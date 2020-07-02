import os
import crud
import model
import server
from faker import Faker
from random import choice, sample, randint
from datetime import datetime, timezone, timedelta, date

os.system('dropdb metacognizant')
os.system('createdb metacognizant')

ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']

model.connect_to_db(server.app)
model.db.create_all()

fake = Faker()

student_names = [
    'Hannah Abbott',
    'Katie Bell',
    'Susan Bones',
    'Terry Boot',
    'Lavender Brown',
    'Millicent Bulstrode',
    'Cho Chang',
    'Penelope Clearwater',
    'Vincent Crabbe',
    'Colin Creevey',
    'Dennis Creevey',
    'Cedric Diggory',
    'Seamus Finnigan',
    'Marcus Flint',
    'Gregory Goyle',
    'Hermione Granger',
    'Angelina Johnson',
    'Lee Jordan',
    'Neville Longbottom',
    'Luna Lovegood',
    'Draco Malfoy',
    'Pansy Parkinson',
    'Padma Patil',
    'Parvati Patil',
    'Harry Potter',
    'Fred Weasley',
    'George Weasley',
    'Ginny Weasley',
    'Percy Weasley',
    'Ron Weasley',
    'Oliver Wood'
]

teacher_names = [
    'Cuthbert Binns',
    'Albus Dumbledore',
    'Argus Filch',
    'Filius Flitwick',
    'Rubeus Hagrid',
    'Rolanda Hooch',
    'Silvanus Kettleburn',
    'Gilderoy Lockhart',
    'Remus Lupin',
    'Minerva McGonagall',
    'Alastor Moody',
    'Quirinus Quirrell',
    'Severus Snape',
    'Pomona Sprout',
    'Sybill Trelawney',
    'Dolores Umbridge'
]

# seed users

# user 1 as admin
crud.create_user('Admin', ' ', 'admin@metacognizant.org', ADMIN_PASSWORD)

students = []
teachers = []

print('Students')
for student_name in student_names:
    #profile = fake.simple_profile()
    first = student_name.split()[0]
    last = student_name.split()[1]
    email = f'{first}{last[0]}@hogwarts.edu'
    password = fake.password()
    print(email, password)
    students.append(crud.create_user(first, last, email, password))

print('Teachers')
for teacher_name in teacher_names:
    #profile = fake.simple_profile()
    first = teacher_name.split()[0]
    last = teacher_name.split()[1]
    email = f'{first[0]}{last}@hogwarts.edu'
    password = fake.password()
    print(email, password)
    teachers.append(crud.create_user(first, last, email, password))

# seed sections & assignments
section_names = ['Potions',
                 'Transfiguration',
                 'Charms',
                 'Herbology',
                 'History of Magic',
                 'Defense Against the Dark Arts',
                 'Divination',
                 'Care of Magical Creatures']
sections = []
section_assignments = []
weighted_roles_student = ['teacher'] + 10 * ['student']
weighted_roles_teacher = ['student'] + 10 * ['teacher']

# seed sections
for i in range(len(section_names)):
    section = crud.create_section(section_names[i],
                                  'Jan 1, 2020',
                                  'Dec 31, 2020')
    sections.append(section)

    # seed section_assignments
    section_students = sample(students, 21)
    for user in section_students:
        role = choice(weighted_roles_student)
        seas = crud.create_section_assignment(user, section, role)
        section_assignments.append(seas)

for teacher in teachers:
    sections_for_teacher = sample(sections, 5)
    for section in sections_for_teacher:
        role = choice(weighted_roles_teacher)
        seas = crud.create_section_assignment(teacher, section, role)
        section_assignments.append(seas)


prompt_questions = [
    'What surprised you today, and why?',
    'What made you curious today? How does learning feel different when you’re curious?',
    'What was most challenging today? What did you do in response?',
    'When were you at your best today, and why?',
    "What would you do differently if you were teaching today's lesson?",
    'What did you learn today? How does it connect to the bigger picture?',
    'What do you feel most and least confident about from today?',
    'How well do you feel you collaborated with your peers today, and why?'
]

# seed prompts, assignments, & responses
prompts = []
prompt_assignments = []
responses = []

# seed prompts
for question in prompt_questions:
    prompt = crud.create_prompt(question)
    prompts.append(prompt)

    # seed prompt_assignments
    prompt_sections = sample(sections, 6)
    for section in prompt_sections:
        date = fake.date_this_year(True, True)
        while crud.check_pras_date(section, date):
            date = fake.date_this_year(True, True)
        pras = crud.create_prompt_assignment(section, prompt, date)
        prompt_assignments.append(pras)

        # seed responses if due date has passed
        if date > date.today():
            continue
        
        # get students in assigned section
        condition1 = (model.SectionAssignment.section_id == section.section_id)
        condition2 = (model.SectionAssignment.role == 'student')
        section_student_assignments = (model.SectionAssignment
                                            .query
                                            .filter(condition1, condition2)
                                            .all())
        # make responses
        for student_assignment in section_student_assignments:
            #choose 10% of assignments to be overdue
            if randint(1, 10) == 1:
                continue
            day_later = date + timedelta(days=1)
            sub_date = fake.date_time_between_dates(date,
                                                    day_later,
                                                    tzinfo=timezone.utc)
            res = crud.create_response(student_assignment.user,
                                       pras,
                                       fake.paragraph(),
                                       sub_date)

# add individuals' prompts
# teachers = crud.get_teacher_assignments()
# for teacher in teachers:
#     for i in range(2):
#         crud.create_prompt(fake.sentence(), teacher)
