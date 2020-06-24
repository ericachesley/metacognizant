import model
import crud
import server
from unittest import TestCase
import json
import os

os.system('dropdb testdb')
os.system('createdb testdb')


class CrudTests(TestCase):

    def setUp(self):
        self.client = server.app.test_client()
        server.app.config['TESTING'] = True

        model.connect_to_db(server.app, "postgresql:///testdb")

        model.db.create_all()
        model.example_data()

    def tearDown(self):
        model.db.session.close()
        model.db.drop_all()

    def test_find_user(self):
        harry = crud.get_user_by_email('hpotter@hogwarts.edu')
        self.assertEqual(harry.first_name, 'Harry')

    def test_update_user(self):
        hashed_password = server.bcrypt.generate_password_hash(
            'scar').decode('utf-8')
        harry = crud.get_user_by_email('hpotter@hogwarts.edu')
        crud.update_user_at_first_login(
            harry, 'Larry', 'Rotter', hashed_password)
        self.assertEqual(harry.first_name, 'Larry')

    def test_create_user(self):
        hashed_password = server.bcrypt.generate_password_hash(
            'thestral').decode('utf-8')
        luna = crud.create_user(
            'Luna', 'Lovegood', 'llovegood@hogwarts.edu', hashed_password)
        self.assertEqual(luna.last_name, "Lovegood")

    def test_get_sections(self):
        sections = crud.get_sections_by_user_id(1)
        tf = model.Section.query.get(1)
        self.assertIn((tf, 'student'), sections)


class FlaskTests(TestCase):

    def setUp(self):
        self.client = server.app.test_client()
        server.app.config['TESTING'] = True

        model.connect_to_db(server.app, "postgresql:///testdb")

        model.db.create_all()
        model.example_data()

    def tearDown(self):
        model.db.session.close()
        model.db.drop_all()

    def test_root(self):
        result = self.client.get('/')
        self.assertIn(b'<div id="app">', result.data)

    def test_login(self):
        hashed_password = server.bcrypt.generate_password_hash(
            'thestral').decode('utf-8')
        luna = crud.create_user(
            'Luna', 'Lovegood', 'llovegood@hogwarts.edu', hashed_password)

        res = self.client.post("/api/login",
                               data=json.dumps({"email": "llovegood@hogwarts.edu",
                                                "password": "thestral"}),
                               content_type='application/json')
        self.assertEqual(res.data, b'[6,"Luna Lovegood"]\n')

    def test_create_account(self):
        res = self.client.post("/api/create_account",
                               data=json.dumps({"first": "Luna",
                                                "last": "Lovegood",
                                                "email": "llovegood@hogwarts.edu",
                                                "password": "thestral"}),
                               content_type='application/json')
        self.assertEqual(res.data, b'[6,"Luna Lovegood"]\n')

    def test_logout(self):
        res = self.client.get('/api/logout')
        self.assertEqual(res.data, b'""\n')


class FlaskTestsLoggedIn(TestCase):
    """Flask tests with user logged in to session."""

    def setUp(self):
        self.client = server.app.test_client()
        server.app.config['TESTING'] = True

        model.connect_to_db(server.app, "postgresql:///testdb")

        model.db.create_all()
        model.example_data()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['logged_in_user_id'] = 3

        def _mock_session():

    def tearDown(self):
        model.db.session.close()
        model.db.drop_all()

    def test_get_sections(self):
        result = self.client.get('/api/get_sections',
                                 content_type='application/json')
        self.assertIn(b'{"name":"Potions","role":"student","section_id":2}',
                      result.data)

    def test_add_class(self):
        res = self.client.post("/api/add_class",
                               data=json.dumps({"name": "Divination",
                                                "start": "Jan 1, 2020",
                                                "end": None}),
                               content_type='application/json')
        self.assertEqual(res.data, b'4\n')

        seas = crud.get_sections_by_user_id(3)
        self.assertIn('teacher', seas[2])

    def test_join_class(self):
        res = self.client.post("/api/join_class",
                               data=json.dumps({"sectionId": 2}),
                               content_type='application/json')
        ron = crud.get_user_by_email('rweasley@hogwarts.edu')
        seas = (model.SectionAssignment
                .query
                .filter(model.SectionAssignment.user == ron,
                        model.SectionAssignment.section_id == 2)
                .first())
        self.assertEqual('student', seas.role)

    def test_add_student(self):
        res = (self.client
               .post("/api/add_student",
                     data=json.dumps({"sectionId": 2,
                                      "studentEmail": 'rweasley@hogwarts.edu'}),
                     content_type='application/json'))
        ron = crud.get_user_by_email('rweasley@hogwarts.edu')
        seas = (model.SectionAssignment
                .query
                .filter(model.SectionAssignment.user == ron,
                        model.SectionAssignment.section_id == 2)
                .first())
        self.assertEqual('student', seas.role)

    def test_update_logged_in(self):
        with self.client.session_transaction() as session:
            res = self.client.get("/api/update_logged_in",
                               data=json.dumps({"userId": 4}),
                               content_type='application/json')
        
            user_id = session['logged_in_user_id']
            self.assertEqual(user_id, 4)


if __name__ == '__main__':
    import unittest
    unittest.main()
