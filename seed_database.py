import os
import crud, model, server
from faker import Faker 
from random import choice, sample

os.system('dropdb metacognizant')
os.system('createdb metacognizant')

model.connect_to_db(server.app)
model.db.create_all()

fake = Faker()

#seed users
users = []

for _ in range(30):
    profile = fake.simple_profile()
    first = profile['name'].split()[0]
    last = profile['name'].split()[1]
    email = profile['mail']
    password = fake.password()
    users.append(crud.create_user(first, last, email, password))


#seed sections & assignments
section_names = ['Algebra', 
                 'U.S. History', 
                 'Chemistry', 
                 'Greek', 
                 'Computer Science']
sections = []
section_assignments = []
weighted_roles = ['teacher'] + 7 * ['student']

#seed sections
for i in range(len(section_names)):
    section = crud.create_section(section_names[i], 
                                  'Jan 1, 2020', 
                                  'Dec 31, 2020')
    sections.append(section)

    #seed section_assignments
    section_members = sample(users, 21)
    for user in section_members:
        role = choice(weighted_roles)
        seas = crud.create_section_assignment(user, section, role)
        section_assignments.append(seas)


#seed prompts, assignments, & responses
prompts = []
prompt_assignments = []
responses = []
weighted_sub_dates = ['Apr 30, 2020'] + 5 * ['May 1, 2020'] + ['May 2, 2020']

#seed prompts
for _ in range(10):
    prompt = crud.create_prompt(fake.sentence())
    prompts.append(prompt)

    #seed prompt_assignments
    prompt_sections = sample(sections, 2)
    for section in prompt_sections:
        pras = crud.create_prompt_assignment(section, prompt, 'May 1, 2020')
        prompt_assignments.append(pras)

        #seed responses

        # for seas in section.section_assignments:
        #     if seas.role == 'student' and seas.section_id == section.section_id:
        #         res = crud.create_response(seas.user, 
        #                                    pras, 
        #                                    fake.paragraph(), 
        #                                    choice(weighted_sub_dates))
        #         responses.append(res)

        #get students in assigned section
        condition1 = (model.SectionAssignment.section_id==section.section_id)
        condition2 = (model.SectionAssignment.role=='student')
        section_student_assignments = (model.SectionAssignment
                                            .query
                                            .filter(condition1, condition2)
                                            .all())
        
        for student_assignment in section_student_assignments:
            res = crud.create_response(student_assignment.user, 
                                       pras, 
                                       fake.paragraph(), 
                                       choice(weighted_sub_dates))




