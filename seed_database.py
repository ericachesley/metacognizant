import os
import crud
import model
import server
from faker import Faker
from random import choice, sample
from datetime import datetime, timezone, timedelta

os.system('dropdb metacognizant')
os.system('createdb metacognizant')

model.connect_to_db(server.app)
model.db.create_all()

fake = Faker()

# seed users
users = []

for _ in range(30):
    profile = fake.simple_profile()
    first = profile['name'].split()[0]
    last = profile['name'].split()[1]
    email = profile['mail']
    password = fake.password()
    users.append(crud.create_user(first, last, email, password))


# seed sections & assignments
section_names = ['Algebra',
                 'U.S. History',
                 'Chemistry',
                 'Greek',
                 'Computer Science']
sections = []
section_assignments = []
weighted_roles = ['teacher'] + 7 * ['student']

# seed sections
for i in range(len(section_names)):
    section = crud.create_section(section_names[i],
                                  'Jan 1, 2020',
                                  'Dec 31, 2020')
    sections.append(section)

    # seed section_assignments
    section_members = sample(users, 21)
    for user in section_members:
        role = choice(weighted_roles)
        seas = crud.create_section_assignment(user, section, role)
        section_assignments.append(seas)


# seed prompts, assignments, & responses
prompts = []
prompt_assignments = []
responses = []

# seed prompts
for _ in range(10):
    prompt = crud.create_prompt(fake.sentence())
    prompts.append(prompt)

    # seed prompt_assignments
    prompt_sections = sample(sections, 2)
    for section in prompt_sections:
        date_time = fake.date_this_year(True, True)
        pras = crud.create_prompt_assignment(section, prompt, date_time)
        prompt_assignments.append(pras)

        # seed responses
        # get students in assigned section
        condition1 = (model.SectionAssignment.section_id == section.section_id)
        condition2 = (model.SectionAssignment.role == 'student')
        section_student_assignments = (model.SectionAssignment
                                            .query
                                            .filter(condition1, condition2)
                                            .all())
        # make responses
        for student_assignment in section_student_assignments:
            day_later = date_time + timedelta(days=1)
            sub_date = fake.date_time_between_dates(date_time,
                                                    day_later,
                                                    tzinfo=timezone.utc)
            res = crud.create_response(student_assignment.user,
                                       pras,
                                       fake.paragraph(),
                                       sub_date)

# add individuals' prompts
teachers = crud.get_teacher_assignments()
for teacher in teachers:
    for i in range(2):
        crud.create_prompt(fake.sentence(), teacher)
