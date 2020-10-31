from ..test_cases import TestCaseWithUsers
from settings import database

class UsersDatabase(TestCaseWithUsers):
    
    USER_1 = {
        'login': 'testUser1',
        'password': 'testPassword1'
    }
    USER_2 = {
        'login': 'testUser2',
        'password': 'testPassword2'
    }
    
    def test_register_user(self):
        data = self.register_user(self.USER_1)
        self.assertIn('user_id', data)

    def test_login_user(self):
        self.register_user(self.USER_1)
        data = database.users.login(**self.USER_1)
        self.assertIsInstance(data['token'], str)
    
    def test_login_user_failed(self):
        self.register_user(self.USER_1)
        data = database.users.login(**self.USER_2)
        self.assertIsNone(data)

    def test_logout_user(self):
        self.register_user(self.USER_1)
        data = database.users.login(**self.USER_1)
        data = database.users.logout(**data)
        self.assertIsNone(data)
