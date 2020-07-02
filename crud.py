from model import (db, connect_to_db, User, Section, SectionAssignment,
                   Prompt, PromptAssignment, Response)
import server
from datetime import datetime
from monkeylearn import MonkeyLearn
import os
from random import choice, random
from flask_bcrypt import Bcrypt

ML_API_KEY = os.environ['MONKEYLEARN_KEY']
ml = MonkeyLearn(ML_API_KEY)

bcrypt = Bcrypt(server.app)

# 'create' functions


def create_user(first, last, email, password, g_id=None, g_credentials=None):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    user = User(first_name=first,
                last_name=last,
                email=email,
                hashed_password=hashed_password,
                g_id=g_id,
                g_credentials=g_credentials)
    db.session.add(user)
    db.session.commit()
    return user


def create_section(name, start, end=None, g_id=None):
    section = Section(name=name, start_date=start, end_date=end, g_id=g_id)
    db.session.add(section)
    db.session.commit()
    return section


def create_section_assignment(user, section, role):
    seas = SectionAssignment(user=user, section=section, role=role)
    db.session.add(seas)
    db.session.commit()
    return seas


def create_section_assignment_by_ids(user_id, section_id, role):
    seas = SectionAssignment(user_id=user_id, section_id=section_id, role=role)
    db.session.add(seas)
    db.session.commit()
    return seas


def create_prompt(content, user=None, prompt_type='text', response_type='text'):
    prompt = Prompt(user=user,
                    prompt_type=prompt_type,
                    response_type=response_type,
                    content=content)
    db.session.add(prompt)
    db.session.commit()
    return prompt


def create_custom_prompt(content, user_id, prompt_type='text', response_type='text'):
    prompt = Prompt(user_id=user_id,
                    prompt_type=prompt_type,
                    response_type=response_type,
                    content=content)
    db.session.add(prompt)
    db.session.commit()
    return prompt


def create_prompt_assignment(section, prompt, due_date, g_id=None, revisit_pras_id=None):
    pras = PromptAssignment(section=section,
                            prompt=prompt,
                            due_date=due_date,
                            g_id=g_id,
                            revisit_pras_id=revisit_pras_id)
    db.session.add(pras)
    db.session.commit()
    return pras


def create_prompt_assignment_by_ids(section_id, prompt_id, due_date, g_id=None, revisit_pras_id=None):
    pras = PromptAssignment(section_id=section_id,
                            prompt_id=prompt_id,
                            due_date=due_date,
                            g_id=g_id,
                            revisit_pras_id=revisit_pras_id)
    db.session.add(pras)
    db.session.commit()
    return pras


def create_revisit_assignment(revisit_pras_id, date, g_id=None):
    old_pras = PromptAssignment.query.get(revisit_pras_id)
    section_id = old_pras.section_id
    prompt_id = old_pras.prompt_id
    new_pras = PromptAssignment(section_id=section_id,
                                prompt_id=prompt_id,
                                due_date=date,
                                g_id=g_id,
                                revisit_pras_id=revisit_pras_id)
    db.session.add(new_pras)
    db.session.commit()
    return (new_pras, old_pras.section.g_id)


def create_response(user, pras, content, sub_date, g_id=None):

    # analysis = ml.classifiers.classify(
    #     model_id='cl_pi3C7JiL',
    #     data=[content]
    # )
    # print(analysis.body[0]['classifications'][0]['tag_name'])
    # print(analysis.body[0]['classifications'][0]['confidence'])

    # sentiment = analysis.body[0]['classifications'][0]['tag_name']
    # confidence = analysis.body[0]['classifications'][0]['confidence']

    sentiment = choice(['Positive', 'Negative', 'Neutral'])
    confidence = random()

    response = Response(user=user,
                        prompt_assignment=pras,
                        content=content,
                        submission_date=sub_date,
                        g_id=g_id,
                        sentiment=sentiment,
                        confidence=confidence)
    db.session.add(response)
    db.session.commit()
    return response


def create_response_by_ids(user_id, pras_id, content, sub_date, g_id=None):
    # analysis = ml.classifiers.classify(
    #     model_id='cl_Jx8qzYJh',
    #     data=[content]
    # )
    # print(analysis.body[0]['classifications'][0]['tag_name'])
    # print(analysis.body[0]['classifications'][0]['confidence'])

    # sentiment = analysis.body[0]['classifications'][0]['tag_name']
    # confidence = analysis.body[0]['classifications'][0]['confidence']

    sentiment = choice(['Positive', 'Negative', 'Neutral'])
    confidence = random()
    
    response = Response(user_id=user_id,
                        pras_id=pras_id,
                        content=content,
                        submission_date=sub_date,
                        g_id=g_id,
                        sentiment=sentiment,
                        confidence=confidence)
    db.session.add(response)
    db.session.commit()
    return response


# 'read' functions
def get_user_by_email(email):
    return User.query.filter(User.email == email).first()


def get_sections_by_user_id(user_id):
    assignments = (SectionAssignment.query
                                    .options(db.joinedload('section'))
                                    .filter(SectionAssignment.user_id == user_id)
                                    .all())
    sections = [(assignment.section, assignment.role)
                for assignment in assignments]
    return sections


def get_section_name(section_id):
    # return Section.query.with_entities(Section.name).get(section_id)
    # return db.session.execute(f'SELECT name FROM sections WHERE section_id = {section_id}')
    section = Section.query.get(section_id)
    return section.name


def get_assignments_by_section_id(section_id):
    condition = (PromptAssignment.section_id == section_id)
    assignments = (PromptAssignment.query
                                   .filter(condition)
                                   .all())
    return assignments


def get_students_by_section_id(section_id):
    condition1 = (SectionAssignment.section_id == section_id)
    condition2 = (SectionAssignment.role == 'student')
    students = (SectionAssignment.query
                                 .options(db.joinedload('user'))
                                 .filter(condition1, condition2)
                                 .all())
    students_info = []
    for student in students:
        students_info.append({'user_id': student.user_id,
                              'first_name': student.user.first_name,
                              'last_name': student.user.last_name})
    return students_info


def get_assignments_to_date(section_id, date):
    condition1 = (PromptAssignment.section_id == section_id)
    condition2 = (PromptAssignment.due_date <= date)
    assignments = (PromptAssignment.query
                                   .filter(condition1, condition2)
                                   .all())
    return assignments


def get_pras_date(pras_id):
    pras = PromptAssignment.query.get(pras_id)
    return pras.due_date


def get_responses_by_assignment_id(assignment_id):
    pras = PromptAssignment.query.get(assignment_id)
    prompt_content = pras.prompt.content
    prompt_id = pras.prompt_id
    due_date = pras.due_date
    if pras.revisit_pras_id is not None:
        revisit = True
        orig_date = get_pras_date(pras.revisit_pras_id)
    else:
        revisit = False
        orig_date = None
    # get existing responses
    responses = (Response.query
                         .options(db.joinedload('prompt_assignment'),
                                  db.joinedload('user'))
                         .filter(Response.pras_id == assignment_id)
                         .all())

    # if no responses yet, return
    if responses == []:
        return [prompt_content, prompt_id, due_date, revisit, orig_date, []]

    # get students
    condition1 = (SectionAssignment.section_id == pras.section_id)
    condition2 = (SectionAssignment.role == 'student')
    seaction_assignments = (SectionAssignment.query
                            .options(db.joinedload('user'))
                            .filter(condition1, condition2)
                            .all())
    students = []
    for seas in seaction_assignments:
        students.append(seas.user)

    # re-format responses
    res_info = []
    for res in responses:
        name = f'{res.user.first_name} {res.user.last_name}'
        res_info.append({'student': name,
                         'last_name': res.user.last_name,
                         'content': res.content,
                         'sentiment': res.sentiment,
                         'confidence': res.confidence,
                         'date': res.submission_date})
        if res.user in students:
            students.remove(res.user)

    # add in students who have not responded yet
    for student in students:
        name = f'{student.first_name} {student.last_name}'
        res_info.append({'student': name,
                         'last_name': student.last_name,
                         'content': 'No response yet.'})
    return [prompt_content, prompt_id, due_date, revisit, orig_date, res_info]


def get_pras_by_section_id(section_id):
    return (PromptAssignment.query
                            .filter(PromptAssignment.section_id == section_id)
                            .all())


def get_responses_by_student_and_section(student_id, section_id):
    prompt_assignments = get_pras_by_section_id(section_id)
    responses = []
    condition1 = (Response.user_id == student_id)
    for pras in prompt_assignments:
        condition2 = (Response.prompt_assignment == pras)
        res = (Response.query
                       .filter(condition1, condition2)
                       .first())
        if res:
            responses.append({'date': res.submission_date,
                              'prompt': pras.prompt.content,
                              'response': res.content,
                              'sentiment': res.sentiment,
                              'confidence': res.confidence})
    return responses


def get_response(pras_id, user_id):
    condition1 = (Response.pras_id == pras_id)
    condition2 = (Response.user_id == user_id)
    response = Response.query.filter(condition1, condition2).first()
    return response


def get_orig_res(pras_id, user_id):
    pras = PromptAssignment.query.get(pras_id)
    orig_pras = PromptAssignment.query.get(pras.revisit_pras_id)
    res = (Response.query
           .filter(Response.user_id == user_id,
                   Response.pras_id == orig_pras.pras_id)
           .first())
    if res:
        return res.content
    else:
        return 'No response submitted'


def check_response(pras_id, user_id):
    condition1 = (Response.pras_id == pras_id)
    condition2 = (Response.user_id == user_id)
    response = Response.query.filter(condition1, condition2).first()
    if response:
        return True
    else:
        return False


def get_all_prompts(user_id):
    condition1 = (Prompt.user_id == user_id)
    condition2 = (Prompt.user_id == None)
    return Prompt.query.filter(condition1 | condition2).all()


def get_teacher_assignments():
    teacherAssignments = (SectionAssignment.query
                          .options(db.joinedload('user'))
                          .filter(SectionAssignment.role == 'teacher')
                          .all())
    teachers = []
    for teas in teacherAssignments:
        teachers.append(teas.user)
    return teachers


def get_users_with_section_info():
    users = User.query.all()
    users_info = []
    for user in users:
        name = f'{user.first_name} {user.last_name}'
        user_sections = []
        sections = (SectionAssignment.query
                    .filter(SectionAssignment.user_id == user.user_id)
                    .all())
        for seas in sections:
            user_sections.append({'name': seas.section.name,
                                  'id': seas.section.section_id,
                                  'role': seas.role})
        users_info.append({'name': name,
                           'id': user.user_id,
                           'sections': user_sections})
    return users_info


def check_pras_date(section, date):
    pras = (PromptAssignment.query
                            .filter(PromptAssignment.section == section,
                                    PromptAssignment.due_date == date)
                            .first())
    if pras:
        return True
    else:
        return False


def get_user_by_gid(g_id):
    return User.query.filter(User.g_id == g_id).first()


def get_user_gid(user_id):
    user = User.query.get(user_id)
    if user:
        return user.g_id
    else:
        return None


def get_course_by_gid(g_id):
    return Section.query.filter(Section.g_id == g_id).first()


def get_seas(user, section):
    condition1 = (SectionAssignment.user == user)
    condition2 = (SectionAssignment.section == section)
    return SectionAssignment.query.filter(condition1, condition2).first()


def get_section(section_id):
    return Section.query.get(section_id)


def get_prompt(prompt_id):
    return Prompt.query.get(prompt_id)


def get_gid_of_section(section_id):
    section = get_section(section_id)
    return section.g_id


def get_credentials(user_id):
    user = User.query.get(user_id)
    return user.g_credentials


def get_prompt_content(prompt_id):
    prompt = Prompt.query.get(prompt_id)
    return prompt.content


def get_gid_of_pras(pras_id):
    pras = PromptAssignment.query.get(pras_id)
    return pras.g_id


def get_section_id_of_pras(pras_id):
    pras = PromptAssignment.query.get(pras_id)
    return pras.section_id


# update functions
def update_user_with_gid(user, gid, credentials):
    user.g_id = gid
    user.g_credentials = credentials
    db.session.commit()
    return user


def update_user_at_first_login(user, first, last, password):
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    user.first_name = first
    user.last_name = last
    user.hashed_password = hashed_password
    db.session.commit()
    return user


def update_revisit_assignment(revisit, google_prasid):
    revisit.g_id = google_prasid
    db.session.commit()
    return revisit


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
