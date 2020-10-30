import unittest
from database import Database

class TestCaseWithDBClear(unittest.TestCase):

    def tearDown(self):
        Database(dbname='socialnetwork').clear()
