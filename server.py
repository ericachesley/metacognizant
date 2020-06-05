from flask import Flask, render_template, request, flash, session, jsonify
from model import connect_to_db
import crud, tests


app = Flask(__name__)
app.secret_key = 'mygreatsecretkey'


@app.route('/')
def show_app():
    return render_template('index.html')


@app.route('/classes')
def show_classes():
    return render_template('index.html')


@app.route('/api/login', methods=['POST'])
def check_credentials():

    email = request.form.get('email')
    password = request.form.get('password')
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
    print(section_id)
    # section = crud.get_section_by_id(section_id)
    assignments = crud.get_assignments_by_section_id(section_id)
    assignments_info = []
    for assignment in assignments:
        assignments_info.append({'pras_id': assignment.pras_id,
                                 'date': assignment.due_date})
    print(assignments_info)
    return jsonify(assignments_info)




if __name__ == '__main__':
    connect_to_db(app)
    tests.get_test_user()
    app.run(host='0.0.0.0', debug=True)