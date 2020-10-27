import requests
import json
import unittest
from database import Database

class UserTests(unittest.TestCase):

    def tearDown(self):
        Database(dbname='socialnetwork').clear()

    def register_user(self, payload):
        return requests.post('http://localhost:5000/users/register', params=payload)
    
    def login_user(self, session, payload):
        return session.post('http://localhost:5000/users/login', params=payload)
    
    def logout_user(self, session):
        return session.delete('http://localhost:5000/users/login', cookies=session.cookies)

    def test_register_user(self):
        response = self.register_user({
            'login': 'testUser1',
            'password': 'testPassword1'
        })
        self.assertEqual(response.status_code, 201)
        self.assertTrue('userId' in json.loads(response.content))
    
    def test_register_two_users(self):
        self.register_user({
            'login': 'testUser1',
            'password': 'testPassword1'
        })
        response = self.register_user({
            'login': 'testUser2',
            'password': 'testPassword2'
        })
        self.assertEqual(response.status_code, 201)
    
    def test_register_user_with_existing_login(self):
        payload = {
            'login': 'testUser1',
            'password': 'testPassword1'
        }
        self.register_user(payload)
        response = self.register_user(payload)
        self.assertEqual(response.status_code, 401)
    
    def test_register_user_with_no_params(self):
        response = self.register_user({})
        self.assertEqual(response.status_code, 401)
    
    def test_register_user_with_no_login(self):
        response = self.register_user({
            'login': '',
            'password': 'testPassword3'
        })
        self.assertEqual(response.status_code, 401)
    
    def test_register_user_with_no_password(self):
        response = self.register_user({
            'login': 'testUser3',
            'password': ''
        })
        self.assertEqual(response.status_code, 401)

    def test_login_user(self):
        payload = {
            'login': 'testUser1',
            'password': 'testPassword1'
        }
        self.register_user(payload)
        session = requests.Session()
        response = self.login_user(session, payload)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('token' in session.cookies)
    
    def test_login_user_when_he_already_loged(self):
        payload = {
            'login': 'testUser1',
            'password': 'testPassword1'
        }
        self.register_user(payload)
        session = requests.Session()
        self.login_user(session, payload)
        response = self.login_user(session, payload)
        self.assertEqual(response.status_code, 401)
    
    def test_logout_user(self):
        payload = {
            'login': 'testUser1',
            'password': 'testPassword1'
        }
        self.register_user(payload)
        session = requests.Session()
        self.login_user(session, payload)
        response = self.logout_user(session)
        self.assertEqual(response.status_code, 205)
        self.assertFalse(session.cookies)
    
    def test_login_user_with_wrong_login(self):
        self.register_user({
            'login': 'testUser1',
            'password': 'testPassword1'
        })
        session = requests.Session()
        response = self.login_user(session, {
            'login': 'doasjdsjadsjodj',
            'password': 'testPassword1'
        })
        self.assertEqual(response.status_code, 401)
        self.assertFalse(session.cookies)
    
    def test_login_user_with_wrong_password(self):
        self.register_user({
            'login': 'testUser1',
            'password': 'testPassword1'
        })
        session = requests.Session()
        response = self.login_user(session, {
            'login': 'testUser1',
            'password': 'fsjfsj'
        })
        self.assertEqual(response.status_code, 401)
        self.assertFalse(session.cookies)
    