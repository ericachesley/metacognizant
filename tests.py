import model, crud, server
from unittest import TestCase

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

    def test_find_user(self):
        harry = crud.get_user_by_email('hpotter@hogwarts.edu')
        self.assertEqual(harry.first_name, 'Harry')

    def test_update_user(self):
        hashed_password = server.bcrypt.generate_password_hash('scar').decode('utf-8')
        harry = crud.get_user_by_email('hpotter@hogwarts.edu')
        crud.update_user_at_first_login(harry, 'Larry', 'Rotter', hashed_password)
        self.assertEqual(harry.first_name, 'Larry')

    def test_create_user(self):
        hashed_password = server.bcrypt.generate_password_hash('thestral').decode('utf-8')
        luna = crud.create_user('Luna', 'Lovegood', 'llovegood@hogwarts.edu', hashed_password)
        self.assertEqual(luna.last_name, "Lovegood")

    def test_get_sections(self):
        sections = crud.get_sections_by_user_id(1)
        tf = model.Section.query.get(1)
        self.assertIn((tf, 'student'), sections)

    def test_login(self):
        result = self.client.get('/')
        self.assertIn(b'<div id="app">', result.data)



if __name__ == '__main__':
    import unittest
    unittest.main()
