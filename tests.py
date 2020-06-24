import model
import crud
import server
from unittest import TestCase
import json


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
        res = self.client.post("/login",
                               data=json.dumps({"email": "hpotter@hogwarts.edu",
                                                "password": "password"}),
                               content_type='application/json')
        #data = json.loads(res.data)
        print(dir(res.data))
        self.assertEqual(res.get_data(), 1)

    def test_logout(self):
        res = self.client.post("/logout")
        data = json.loads(res.get_data(as_text=True))
        self.assertEqual(data, '')


class FlaskTestsLoggedIn(TestCase):
    """Flask tests with user logged in to session."""

    def setUp(self):
        """Stuff to do before every test."""

        server.app.config['TESTING'] = True
        server.app.config['SECRET_KEY'] = 'key'
        self.client = server.app.test_client()

        with self.client as c:
            with c.session_transaction() as sess:
                sess['logged_in_user_id'] = 1

    # def test_important_page(self):
    #     """Test important page."""

    #     result = self.client.get('/api/get_sections')
    #     print(result)
    #     data = json.loads(result.data)
    #     print(data)
    #     tf = model.Section.query.get(1)
    #     self.assertIn({'section_id': tf.section_id,
    #                    'name': tf.name,
    #                    'role': 'student'
    #                    }, result.data)


if __name__ == '__main__':
    import unittest
    unittest.main()
