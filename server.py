from flask import Flask, render_template
from model import connect_to_db


app = Flask(__name__)
app.secret_key = 'mygreatsecretkey'


@app.route('/')
def show_app():
    return render_template('index.html')


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)