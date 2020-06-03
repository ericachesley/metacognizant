from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    #section_assignments
    #responses


class Section(db.Model):

    __tablename__ = 'sections'

    section_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)

    #section_assignments
    #question_assignments


class SectionAssignment(db.Model):

    __tablename__ = 'section_assignments'

    seas_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    section_id = db.Column(db.Integer, db.ForeignKey('sections.section_id'))
    role = db.Column(db.String, nullable=False)

    user = db.relationship('User', backref='section_assignments')
    section = db.relationship('Section', backref='section_assignments')


class Question(db.Model):

    __tablename__ = 'questions'

    question_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    question_type = db.Column(db.String)
    response_type = db.Column(db.String)
    content = db.Column(db.Text, nullable=False)

    #question_assignments


class QuestionAssignment(db.Model):

    __tablename__ = 'question_assignments'

    quas_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.section_id'))
    question_id = db.Column(db.Integer, db.ForeignKey('questions.question_id'))
    due_date = db.Column(db.DateTime, nullable=False)

    section = db.relationship('Section', backref='question_assignment')
    question = db.relationship('Question', backref='question_assignment')

    #responses


class Response(db.Model):

    __tablename__ = 'responses'

    response_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    quas_id = db.Column(db.Integer, 
                             db.ForeignKey('question_assignments.quas_id'))
    content = db.Column(db.Text, nullable=False)
    submission_date = db.Column(db.DateTime)

    user = db.relationship('User', backref='responses')
    question_assignment = db.relationship('QuestionAssignment', 
                                           backref='responses')



def connect_to_db(flask_app, db_uri='postgresql:///ratings', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')



if __name__ == '__main__':
    from server import app
    connect_to_db(app)




