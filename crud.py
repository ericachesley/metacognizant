from model import (db, connect_to_db, User, Section, SectionAssignment, 
                   Prompt, PromptAssignment, Response)
import server


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


def create_response(user, pras, content, sub_date):
    response = Response(user=user, 
                        prompt_assignment=pras, 
                        content=content, 
                        submission_date=sub_date)
    db.session.add(response)
    db.session.commit()
    return response


#'get' functions
def get_user_by_email(email):
    return User.query.filter(User.email==email).first()



if __name__ == '__main__':
    from server import app
    connect_to_db(app)


