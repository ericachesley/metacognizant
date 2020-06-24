from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):

    __tablename__ = 'users'

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    hashed_password = db.Column(db.String)
    g_id = db.Column(db.String)
    g_credentials = db.Column(db.PickleType)

    # section_assignments
    # responses
    # prompts

    def __repr__(self):
        return f'<User id={self.user_id} name={self.first_name} {self.last_name}>'


class Section(db.Model):

    __tablename__ = 'sections'

    section_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime)
    g_id = db.Column(db.String)

    # section_assignments
    # prompt_assignments

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

    # prompt_assignments

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

    # responses

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
    prompt_assignment = db.relationship(
        'PromptAssignment', backref='responses')

    def __repr__(self):
        return f'<Response id={self.response_id} user={self.user_id} prompt_assignment={self.pras_id}>'


def example_data():
    User.query.delete()
    Section.query.delete()
    SectionAssignment.query.delete()
    Prompt.query.delete()
    PromptAssignment.query.delete()
    Response.query.delete()

    # hash of 'password'
    hashed_password = '$2b$12$brfYnA5eqd.n8L.ZRleJze4uNDrJlSz.AT/FlNYDg9ZM86KRCClxG$2b$12$NX8v.WFZk01qezQfkabuouJnegMcz9os2jDCJ5J.XBknNzL25sSOy'

    harry = User(first_name='Harry',
                 last_name='Potter',
                 email='hpotter@hogwarts.edu',
                 hashed_password=hashed_password,
                 g_id=None,
                 g_credentials=None)

    hermione = User(first_name='Hermione',
                    last_name='Granger',
                    email='hgranger@hogwarts.edu',
                    hashed_password=hashed_password,
                    g_id=None,
                    g_credentials=None)

    ron = User(first_name='Ron',
               last_name='Weasley',
               email='rweasley@hogwarts.edu',
               hashed_password=hashed_password,
               g_id=None,
               g_credentials=None)

    minerva = User(first_name='Minerva',
                   last_name='McGonagall',
                   email='mmcgonagall@hogwarts.edu',
                   hashed_password=hashed_password,
                   g_id=None,
                   g_credentials=None)

    severus = User(first_name='Severus',
                   last_name='Snape',
                   email='ssnape@hogwarts.edu',
                   hashed_password=hashed_password,
                   g_id=None,
                   g_credentials=None)

    tf = Section(name='Transfiguration',
                 start_date='Jan 1, 2020',
                 end_date=None,
                 g_id=None)

    pot = Section(name='Potions',
                  start_date='Jan 1, 2020',
                  end_date=None,
                  g_id=None)

    spew = Section(name='Society for the Promotion of Elfish Welfare',
                   start_date='Jan 1, 2020',
                   end_date=None,
                   g_id=None)

    seas1 = SectionAssignment(user=harry, section=tf, role='student')
    seas2 = SectionAssignment(user=harry, section=pot, role='student')
    seas3 = SectionAssignment(user=harry, section=spew, role='student')
    seas4 = SectionAssignment(user=hermione, section=tf, role='student')
    seas5 = SectionAssignment(user=hermione, section=pot, role='student')
    seas6 = SectionAssignment(user=hermione, section=spew, role='teacher')
    seas7 = SectionAssignment(user=ron, section=tf, role='student')
    seas8 = SectionAssignment(user=ron, section=pot, role='student')
    seas9 = SectionAssignment(user=minerva, section=tf, role='teacher')
    seas10 = SectionAssignment(user=minerva, section=pot, role='teacher')
    seas11 = SectionAssignment(user=minerva, section=spew, role='student')
    seas12 = SectionAssignment(user=severus, section=pot, role='teacher')

    learned = Prompt(user=None,
                     prompt_type='text',
                     response_type='text',
                     content='What did you learn today?')

    challenging = Prompt(user=None,
                         prompt_type='text',
                         response_type='text',
                         content='What was the most challenging concept today?')

    aha = Prompt(user=None,
                 prompt_type='text',
                 response_type='text',
                 content='What aha moment did you have today?')

    nbot = Prompt(user=None,
                  prompt_type='text',
                  response_type='text',
                  content='Nitwit blubber oddment tweak')

    leviosa = Prompt(user=minerva,
                     prompt_type='text',
                     response_type='text',
                     content='What spell would you use for levitation and why?')

    bezoar = Prompt(user=severus,
                    prompt_type='text',
                    response_type='text',
                    content='Where would you look if I asked you to find me a bezoar?')

    draught = Prompt(user=severus,
                     prompt_type='text',
                     response_type='text',
                     content='What would I get if I added powdered root of asphodel to an infusion of wormwood?')

    sock = Prompt(user=hermione,
                  prompt_type='text',
                  response_type='text',
                  content='What is the best method for liberating a house elf?')

    pras1 = PromptAssignment(section=tf,
                             prompt=leviosa,
                             due_date='Jun 24, 2020',
                             g_id=None)

    pras2 = PromptAssignment(section=pot,
                             prompt=bezoar,
                             due_date='Jun 20, 2020',
                             g_id=None)

    pras3 = PromptAssignment(section=spew,
                             prompt=sock,
                             due_date='Jun 30, 2020',
                             g_id=None)

    res1 = Response(user=harry,
                    prompt_assignment=pras2,
                    content="I don't know, sir.",
                    submission_date='Jun 21, 2020',
                    g_id=None)

    res2 = Response(user=hermione,
                    prompt_assignment=pras2,
                    content="In the stomach of a goat",
                    submission_date='Jun 21, 2020',
                    g_id=None)

    res3 = Response(user=hermione,
                    prompt_assignment=pras1,
                    content="It's levioooosa, not leviosaaa.",
                    submission_date='Jun 21, 2020',
                    g_id=None)

    db.session.add_all([harry, hermione, ron, minerva, severus, tf, pot, spew, 
                        seas1, seas2, seas3, seas4, seas5, seas6, seas7, seas8, 
                        seas9, seas10, seas11, seas12, learned, challenging, 
                        aha, nbot, leviosa, bezoar, draught, sock, pras1, pras2, 
                        pras3, res1, res2, res3])
    db.session.commit()


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
