import json
from requests import Session
from .test_cases import UsersTestCase

class UserTests(UsersTestCase):

    def test_register_user(self):
        response = self.register_user(self.USER_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('userId' in json.loads(response.content))
    
    def test_register_two_users(self):
        self.register_user(self.USER_1_PAYLOAD)
        response = self.register_user(self.USER_2_PAYLOAD)
        self.assertEqual(response.status_code, 201)
    
    def test_register_user_with_existing_login(self):
        payload = self.USER_1_PAYLOAD
        self.register_user(payload)
        response = self.register_user(payload)
        self.assertEqual(response.status_code, 401)
    
    def test_register_user_with_no_payload(self):
        response = self.register_user({})
        self.assertEqual(response.status_code, 400)
    
    def test_register_user_with_no_login(self):
        payload = self.USER_1_PAYLOAD.copy()
        payload.pop('login')
        response = self.register_user(payload)
        self.assertEqual(response.status_code, 400)
    
    def test_register_user_with_no_password(self):
        payload = self.USER_1_PAYLOAD.copy()
        payload.pop('password')
        response = self.register_user(payload)
        self.assertEqual(response.status_code, 400)

    def test_login_user(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        response = self.login_user(session, self.USER_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('token' in session.cookies)
    
    def test_login_user_when_he_already_loged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.login_user(session, self.USER_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
    
    def test_login_user_when_another_user_loged(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.login_user(session, self.USER_2_PAYLOAD)
        response = self.login_user(session, self.USER_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
    
    def test_logout_user(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.logout_user(session)
        self.assertEqual(response.status_code, 205)
        self.assertFalse(session.cookies)
    
    def test_login_user_with_wrong_login(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        payload = self.USER_1_PAYLOAD.copy()
        payload['login'] = 'tjwoejfksfd'
        response = self.login_user(session, payload)
        self.assertEqual(response.status_code, 401)
        self.assertFalse(session.cookies)
    
    def test_login_user_with_wrong_password(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        payload = self.USER_1_PAYLOAD.copy()
        payload['password'] = 'dkfdfsfeptkeop'
        response = self.login_user(session, payload)
        self.assertEqual(response.status_code, 401)
        self.assertFalse(session.cookies)
    