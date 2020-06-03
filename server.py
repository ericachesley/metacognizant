from flask import Flask, render_template, request, flash, session, jsonify
from model import connect_to_db
import crud, tests


app = Flask(__name__)
app.secret_key = 'mygreatsecretkey'


@app.route('/')
def show_app():
    return render_template('index.html')


@app.route('/api/login', methods=['POST'])
def check_credentials():

    email = request.form.get('email')
    password = request.form.get('password')
    user = crud.get_user_by_email(email)

    status = False

    if not user:
        status = 'That email address is not associated with a user in our system.'
    elif user.password == password:
        session['logged_in_user_email'] = email
        status = 'Login successful.'
    else:
        status = 'Incorrect password.'

    return jsonify(status)


if __name__ == '__main__':
    connect_to_db(app)
    tests.get_test_user()
    app.run(host='0.0.0.0', debug=True)