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
                sess['logged_in_user_id'] = 1

    def test_get_sections(self):
        result = self.client.get('/api/get_sections',
                                 content_type='application/json')
        self.assertIn(b'{"name":"Potions","role":"student","section_id":2}',
                      result.data)


if __name__ == '__main__':
    import unittest
    unittest.main()
