import unittest
from database import Database
from settings import database

class TestCaseWithDBClear(unittest.TestCase):

    def tearDown(self):
        Database(dbname='socialnetwork').clear()

class TestCaseWithUsers(TestCaseWithDBClear):
    
    def register_user(self, user_data):
        user = database.users.register(**user_data)
        database.profiles.create(**user)
        database.contacts.create(**user)
        return user
