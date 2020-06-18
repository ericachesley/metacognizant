from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class User(db.Model):

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String)
    g_id = db.Column(db.String)

    #section_assignments
    #responses
    #prompts

    def __repr__(self):
        return f'<User id={self.user_id} name={self.first_name} {self.last_name}>'


class Section(db.Model):

    __tablename__ = 'sections'

    section_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    g_id = db.Column(db.String)

    #section_assignments
    #prompt_assignments

    def __repr__(self):
        return f'<Section id={self.section_id} name={self.name}>'


class SectionAssignment(db.Model):

    __tablename__ = 'section_assignments'

    seas_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    section_id = db.Column(db.Integer, db.ForeignKey('sections.section_id'))
    role = db.Column(db.String, nullable=False)

    user = db.relationship('User', backref='section_assignments')
    section = db.relationship('Section', backref='section_assignments')

    def __repr__(self):
        return f'<SectionAssignment id={self.seas_id} user={self.user_id} section={self.section_id}>'


class Prompt(db.Model):

    __tablename__ = 'prompts'

    prompt_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    prompt_type = db.Column(db.String)
    response_type = db.Column(db.String)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    user = db.relationship('User', backref='prompts')

    #prompt_assignments

    def __repr__(self):
        return f'<Prompt id={self.prompt_id} content={self.content}>'


class PromptAssignment(db.Model):

    __tablename__ = 'prompt_assignments'

    pras_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.section_id'))
    prompt_id = db.Column(db.Integer, db.ForeignKey('prompts.prompt_id'))
    due_date = db.Column(db.DateTime, nullable=False)

    section = db.relationship('Section', backref='prompt_assignments')
    prompt = db.relationship('Prompt', backref='prompt_assignments')
    g_id = db.Column(db.String)

    #responses

    def __repr__(self):
        return f'<PromptAssignment id={self.pras_id} section={self.section_id} prompt={self.prompt_id}>'


class Response(db.Model):

    __tablename__ = 'responses'

    response_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    pras_id = db.Column(db.Integer, 
                        db.ForeignKey('prompt_assignments.pras_id'))
    content = db.Column(db.Text, nullable=False)
    submission_date = db.Column(db.DateTime)
    g_id = db.Column(db.String)

    user = db.relationship('User', backref='responses')
    prompt_assignment = db.relationship('PromptAssignment', backref='responses')


    def __repr__(self):
        return f'<Response id={self.response_id} user={self.user_id} prompt_assignment={self.pras_id}>'


def connect_to_db(flask_app, db_uri='postgresql:///metacognizant', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    #flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')



if __name__ == '__main__':
    from server import app
    connect_to_db(app)




