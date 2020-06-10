from model import (db, connect_to_db, User, Section, SectionAssignment, 
                   Prompt, PromptAssignment, Response)
import server
from datetime import datetime


#'create' functions
def create_user(first, last, email, password):
    user = User(first_name=first, 
                last_name=last, 
                email=email, 
                password=password)
    db.session.add(user)
    db.session.commit()
    return user


def create_section(name, start, end):
    section = Section(name=name, start_date=start, end_date=end)
    db.session.add(section)
    db.session.commit()
    return section


def create_section_assignment(user, section, role):
    seas = SectionAssignment(user=user, section=section, role=role)
    db.session.add(seas)
    db.session.commit()
    return seas


def create_prompt(content, prompt_type='text', response_type='text'):
    prompt = Prompt(prompt_type=prompt_type, 
                    response_type=response_type, 
                    content=content)
    db.session.add(prompt)
    db.session.commit()
    return prompt


def create_prompt_assignment(section, prompt, due_date):
    pras = PromptAssignment(section=section, prompt=prompt, due_date=due_date)
    db.session.add(pras)
    db.session.commit()
    return pras


def create_prompt_assignment_by_ids(section_id, prompt_id, due_date):
    pras = PromptAssignment(section_id=section_id, 
                            prompt_id=prompt_id, 
                            due_date=due_date)
    db.session.add(pras)
    db.session.commit()
    return pras


def create_response(user, pras, content, sub_date):
    response = Response(user=user, 
                        prompt_assignment=pras, 
                        content=content, 
                        submission_date=sub_date)
    db.session.add(response)
    db.session.commit()
    return response


def create_response_by_ids(user_id, pras_id, content, sub_date):
    response = Response(user_id=user_id, 
                        pras_id=pras_id, 
                        content=content, 
                        submission_date=sub_date)
    db.session.add(response)
    db.session.commit()
    return response


#'read' functions
def get_user_by_email(email):
    return User.query.filter(User.email==email).first()


def get_sections_by_user_id(user_id):
    assignments = (SectionAssignment.query
                                    .options(db.joinedload('section'))
                                    .filter(SectionAssignment.user_id==user_id)
                                    .all())
    sections = [(assignment.section, assignment.role) 
                for assignment in assignments]
    return sections


def get_assignments_by_section_id(section_id):
    condition = (PromptAssignment.section_id==section_id)
    assignments = (PromptAssignment.query
                                   .filter(condition)
                                   .all())
    return assignments


def get_students_by_section_id(section_id):
    condition1 = (SectionAssignment.section_id==section_id)
    condition2 = (SectionAssignment.role=='student')
    students = (SectionAssignment.query
                                 .options(db.joinedload('user'))
                                 .filter(condition1, condition2)
                                 .all())
    students_info = []
    for student in students:
        students_info.append({'user_id':student.user_id, 
                              'first_name':student.user.first_name, 
                              'last_name':student.user.last_name})
    return students_info


def get_assignments_to_date(section_id, date):
    print(date)
    #date = datetime.fromisoformat(date)
    condition1 = (PromptAssignment.section_id==section_id)
    condition2 = (PromptAssignment.due_date<=date)
    assignments = (PromptAssignment.query
                                   .filter(condition1, condition2)
                                   .all())
    return assignments


def get_responses_by_assignment_id(assignment_id):
    pras = PromptAssignment.query.get(assignment_id)
    prompt_content = pras.prompt.content
    responses = (Response.query
                         .options(db.joinedload('prompt_assignment'),
                         db.joinedload('user'))
                         .filter(Response.pras_id==assignment_id)
                         .all())
    return [prompt_content, responses]


def get_responses_by_student(student_id):
    responses = (Response.query
                         .options(db.joinedload('prompt_assignment'))
                         .filter(Response.user_id==student_id)
                         .all())
    responses_info = []
    for res in responses:
        responses_info.append({'date':res.submission_date,
                               'prompt':res.prompt_assignment.prompt.content,
                               'response':res.content})
    return responses_info


def get_response(pras_id, user_id):
    condition1 = (Response.pras_id==pras_id)
    condition2 = (Response.user_id==user_id)
    response = Response.query.filter(condition1, condition2).first()
    return response


def get_all_prompts():
    return Prompt.query.all()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)


