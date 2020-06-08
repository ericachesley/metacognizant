from flask import Flask, render_template, request, flash, session, jsonify
from model import connect_to_db
import crud, tests
import json

app = Flask(__name__)
app.secret_key = 'mygreatsecretkey'


@app.route('/', defaults={'path':''})
@app.route('/<path:path>')
def show_app(path):
    return render_template('index.html')


@app.route('/api/login', methods=['POST'])
def check_credentials():
    data = request.get_json(force=True)
    email = data['email']
    password = data['password']
    user = crud.get_user_by_email(email)

    if not user:
        status = 'That email address is not associated with a user in our system.'
    elif user.password == password:
        session['logged_in_user_id'] = user.user_id
        status = user.user_id
    else:
        status = 'Incorrect password.'

    return jsonify(status)


@app.route('/api/get_sections')
def return_sections():
    user_id = request.args.get('userId')
    sections = crud.get_sections_by_user_id(user_id)
    sections_info = []
    for section in sections:
        sections_info.append({'section_id': section[0].section_id,
                              'name': section[0].name, 
                              'role': section[1]})
    return jsonify(sections_info)


@app.route('/api/get_pras')
def return_assignments():
    section_id = request.args.get('sectionId')
    assignments = crud.get_assignments_by_section_id(section_id)
    assignments_info = []
    for assignment in assignments:
        assignments_info.append({'pras_id': assignment.pras_id,
                                 'date': assignment.due_date})
    return jsonify(assignments_info)


@app.route('/api/get_responses')
def return_responses():
    assignment_id = request.args.get('assignmentId')
    content, responses = crud.get_responses_by_assignment_id(assignment_id)
    res_info = []
    for res in responses:
        name = f'{res.user.first_name} {res.user.last_name}'
        res_info.append({'student': name,
                         'content': res.content, 
                         'date': res.submission_date})
    return jsonify([content, res_info])


@app.route('/api/get_prompts')
def return_all_prompts():
    prompts = crud.get_all_prompts()
    prompt_info =[]
    for prompt in prompts:
        prompt_info.append({'prompt_id':prompt.prompt_id, 
                            'content': prompt.content})
    return jsonify(prompt_info)


@app.route('/api/assign_prompt', methods=['POST'])
def add_prompt_assignment():
    data = request.get_json(force=True)
    section_ids = data['selectedSections']
    prompt_id = data['selectedPrompt']
    date = data['date']
    print(section_ids, prompt_id, date)

    new_pras = []
    for section_id in section_ids:
        pras = crud.create_prompt_assignment_by_ids(int(section_id), prompt_id, date)
        new_pras.append({'id': pras.pras_id, 'section':pras.section_id})

    return jsonify(new_pras)
    

if __name__ == '__main__':
    connect_to_db(app)
    tests.find_test_teacher()
    app.run(host='0.0.0.0', debug=True)