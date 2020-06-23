from flask import Flask, render_template, request, flash, session, jsonify
from model import connect_to_db
import crud, gapi, tests
import json, pickle
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt

#import bcrypt
#import jwt

from apiclient import discovery, errors
import httplib2
from oauth2client import client

app = Flask(__name__)
app.secret_key = 'mygreatsecretkey'
bcrypt = Bcrypt(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def show_app(path):
    session['requested_path'] = path
    return render_template('index.html')


@app.route('/api/get_path')
def return_path():
    path = session['requested_path']
    return jsonify(path)


@app.route('/api/login', methods=['POST'])
def check_credentials():
    data = request.get_json()
    email = data['email']
    password = data['password']
    user = crud.get_user_by_email(email)

    if not user:
        res = 'That email address is not associated with a user in our system. Please create an account.'
    elif user.hashed_password == None and user.g_id == None:
        res = 'It looks like this is your first time logging in. Please create an account to complete your login.'
    elif user.hashed_password == None and user.g_id:
        res = "Please use the 'Sign in with Google' option to log in."
    elif not bcrypt.check_password_hash(user.hashed_password, password):
        res = 'Incorrect password. Please try again.'
    else:
        session['logged_in_user_id'] = user.user_id
        name = f'{user.first_name} {user.last_name}'
        res = [user.user_id, name]

    return jsonify(res)


@app.route('/api/create_account', methods=['POST'])
def create_account():
    data = request.get_json()
    email = data['email']
    password = data['password']
    first = data['first']
    last = data['last']
    name = f'{first} {last}'

    user = crud.get_user_by_email(email)
    password_hashed = bcrypt.generate_password_hash(password).decode('utf-8')

    if user:
        if user.hashed_password or user.g_id:
            res = 'That email address is already associated with a user in our system. Please log in.'
        else:
            user = crud.update_user_at_first_login(user, 
                                                   first, 
                                                   last, 
                                                   password_hashed)
            session['logged_in_user_id'] = user.user_id
            res = [user.user_id, name]
    else:
        user = crud.create_user(first, last, email, password_hashed)
        session['logged_in_user_id'] = user.user_id
        res = [user.user_id, name]

    return jsonify(res)


@app.route('/api/add_class', methods=['POST'])
def add_section():
    data = request.get_json()
    name = data['name']
    start = data['start']
    end = data['end']

    section = crud.create_section(name, start, end)
    print("Added: ", section)

    user_id = session['logged_in_user_id']
    seas = crud.create_section_assignment_by_ids(user_id, section.section_id, 'teacher')
    print('Added: ', seas)

    return jsonify(section.section_id)


@app.route('/api/join_class', methods=['POST'])
def join_section():
    data = request.get_json()
    section_id = data['sectionId']

    user_id = session['logged_in_user_id']
    seas = crud.create_section_assignment_by_ids(user_id, section_id, 'student')
    print('Added: ', seas)

    return jsonify(seas.seas_id)


@app.route('/api/add_student', methods=['POST'])
def add_student():
    data = request.get_json()
    student_email = data['studentEmail']
    section_id = data['sectionId']
    new = False

    student = crud.get_user_by_email(student_email)
    if not student:
        new = True
        student = crud.create_user(student_email, ' ', student_email, None)

    seas = crud.create_section_assignment_by_ids(student.user_id, 
                                                 section_id, 
                                                 'student')
    print('Added: ', seas)
    return jsonify([seas.seas_id, new])


@app.route('/api/update_logged_in')
def update_logged_in():
    user_id = request.args.get('userId')
    session['logged_in_user_id'] = user_id
    google_userid = crud.get_user_gid(user_id)
    if google_userid:
        session['google_userid'] = google_userid
    return jsonify('User updated')


@app.route('/api/logout')
def logout():
    session.clear()
    return jsonify('')


@app.route('/api/get_sections')
def return_sections():
    user_id = session['logged_in_user_id']
    sections = crud.get_sections_by_user_id(user_id)
    sections_info = []
    for section in sections:
        sections_info.append({'section_id': section[0].section_id,
                              'name': section[0].name,
                              'role': section[1]})
    sections_info.sort(key=lambda i: i['name'])
    return jsonify(sections_info)


@app.route('/api/get_pras')
def return_assignments():
    section_id = request.args.get('sectionId')
    assignments = crud.get_assignments_by_section_id(section_id)
    assignments_info = []
    for assignment in assignments:
        assignments_info.append({'pras_id': assignment.pras_id,
                                 'date': assignment.due_date})
    assignments_info.sort(key=lambda i: i['date'])
    return jsonify(assignments_info)


@app.route('/api/get_students')
def return_students():
    section_id = request.args.get('sectionId')
    students = crud.get_students_by_section_id(section_id)
    students.sort(key=lambda i: i['last_name'])
    students_info = []
    for student in students:
        first = student['first_name']
        last = student['last_name']
        name = f'{first} {last}'
        students_info.append({'user_id': student['user_id'],
                              'name': name})
    return jsonify(students_info)


@app.route('/api/get_pras_to_date')
def return_assignments_to_date():
    section_id = request.args.get('sectionId')
    date = request.args.get('date')
    assignments = crud.get_assignments_to_date(section_id, date)
    user_id = session['logged_in_user_id']
    assignments_info = []
    for assignment in assignments:
        res = crud.check_response(assignment.pras_id, user_id)
        assignments_info.append({'pras_id': assignment.pras_id,
                                 'date': assignment.due_date,
                                 'res': res})
    assignments_info.sort(key=lambda i: i['date'])
    return jsonify(assignments_info)


@app.route('/api/get_responses')
def return_responses():
    assignment_id = request.args.get('assignmentId')
    prompt, due_date, responses = crud.get_responses_by_assignment_id(
        assignment_id)
    responses.sort(key=lambda i: i['last_name'])
    return jsonify([prompt, due_date, responses])


@app.route('/api/get__student_responses')
def return_student_responses():
    student_id = request.args.get('studentId')
    section_id = request.args.get('sectionId')
    responses = crud.get_responses_by_student_and_section(
        student_id, section_id)
    responses.sort(key=lambda i: i['date'])
    return jsonify(responses)


@app.route('/api/get_prompts')
def return_all_prompts():
    user_id = session['logged_in_user_id']
    prompts = crud.get_all_prompts(user_id)
    prompt_info = []
    for prompt in prompts:
        prompt_info.append({'prompt_id': prompt.prompt_id,
                            'content': prompt.content})
    return jsonify(prompt_info)


@app.route('/api/assign_prompt', methods=['POST'])
def add_prompt_assignment():
    data = request.get_json()
    section_ids = data['selectedSections']
    prompt_id = data['selectedPrompt']
    date = data['date']
    newPrompt = data['newPrompt']

    if newPrompt:
        user_id = session['logged_in_user_id']
        prompt = crud.create_custom_prompt(prompt_id, user_id)
        prompt_id = prompt.prompt_id

    new_pras = []
    for section_id in section_ids:

        google_prasid = None

        google_sectionid = crud.get_gid_of_section(section_id)
        if google_sectionid:
            credentials = crud.get_credentials(session['logged_in_user_id'])
            google_prasid = gapi.create_google_assignment(credentials, 
                                                          section_id,
                                                          google_sectionid, 
                                                          prompt_id,
                                                          date)                                      

        pras = crud.create_prompt_assignment_by_ids(int(section_id), 
                                                    prompt_id, 
                                                    date, 
                                                    google_prasid)
        new_pras.append({'id': pras.pras_id, 'section': pras.section_id})

    return jsonify(new_pras)


@app.route('/api/check_response')
def check_for_response():
    pras_id = request.args.get('assignmentId')
    user_id = session['logged_in_user_id']
    res = crud.get_response(pras_id, user_id)
    if res:
        return jsonify({'response': res.content, 'date': res.submission_date})
    else:
        return jsonify(None)


@app.route('/api/submit_response', methods=['POST'])
def create_response():
    data = request.get_json()
    response = data['response']
    date = data['date']
    user_id = session['logged_in_user_id']
    pras_id = data['assignmentId']
    google_resid = None

    google_prasid = crud.get_gid_of_pras(pras_id)
    if google_prasid:
        print('yeah')
        google_userid = session['google_userid']
        google_sectionid = crud.get_gid_of_section(crud.get_section_id_of_pras(pras_id))
        credentials = crud.get_credentials(session['logged_in_user_id'])
        google_resid = gapi.create_google_response(credentials, 
                                                   google_sectionid,
                                                   google_prasid, 
                                                   google_userid, 
                                                   response, 
                                                   date)

    res = crud.create_response_by_ids(user_id, 
                                      pras_id, 
                                      response, 
                                      date, 
                                      google_resid)

    return jsonify({'id': res.response_id})


@app.route('/api/get_all_users')
def return_users():
    users = crud.get_users_with_section_info()
    users.sort(key=lambda i: i['name'])
    return jsonify(users)


@app.route('/api/login_with_google', methods=['POST'])
def google_login():
    # If this request does not have `X-Requested-With` header, this could be a CSRF
    if not request.headers.get('X-Requested-With'):
        abort(403)

    auth_code = request.get_data()

    # Set path to the Web application client_secret_*.json file you downloaded from the
    # Google API Console: https://console.developers.google.com/apis/credentials
    CLIENT_SECRET_FILE = 'credentials.json'

    # Exchange auth code for access token, refresh token, and ID token
    credentials = client.credentials_from_clientsecrets_and_code(
        CLIENT_SECRET_FILE,
        [
            "https://www.googleapis.com/auth/classroom.courses.readonly \
             https://www.googleapis.com/auth/classroom.rosters.readonly \
             https://www.googleapis.com/auth/classroom.coursework.students.readonly \
             https://www.googleapis.com/auth/classroom.coursework.students \
             https://www.googleapis.com/auth/classroom.coursework.me",
            'profile',
            'email'
        ],
        auth_code)

    # Get profile info from ID token
    google_userid = credentials.id_token['sub']
    google_email = credentials.id_token['email']
    session['google_userid'] = google_userid
    

    # get or create user in database
    if crud.get_user_by_gid(google_userid):
        user = crud.get_user_by_gid(google_userid)
    elif crud.get_user_by_email(google_email):
        user = crud.get_user_by_email(google_email)
        crud.update_user_with_gid(user, google_userid, credentials)
    else:
        user = gapi.add_google_user(credentials)

    # make sure google courses are up to date in db
    gapi.check_google_courses(user, credentials)

    session['logged_in_user_id'] = user.user_id
    name = f'{user.first_name} {user.last_name}'
    return jsonify([user.user_id, name])



if __name__ == '__main__':
    connect_to_db(app)
    tests.find_test_teacher()
    app.run(host='0.0.0.0', debug=True)
