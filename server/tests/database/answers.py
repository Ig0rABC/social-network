import unittest
from database import Database
from settings import database

class CommentsDatabase(unittest.TestCase):

    USER_1 = {
        'login': 'testUser1',
        'password': 'testPassword1'
    }
    USER_2 = {
        'login': 'testUser2',
        'password': 'testPassword2'
    }
    POST_1 = {
        'category': 'Programming',
        'content': 'python'
    }
    COMMENT_1 = {
        'post_id': 1,
        'content': 'daskdoak'
    }
    COMMENT_2 = {
        'post_id': 2,
        'content': 'fsdfdmfr'
    }
    ANSWER_1 = {
        'comment_id': 1,
        'content': '523040'
    }
    ANSWER_2 = {
        'comment_id': 2,
        'content': '98520'
    }

    def tearDown(self):
        Database(dbname='socialnetwork').clear()
    
    def test_create_answer(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        comment = database.comments.create(author_id=1, **self.COMMENT_1)
        answer = database.answers.create(author_id=1, **self.ANSWER_1)
        self.assertEqual(answer['id'], 1)
        self.assertEqual(answer['author_id'], 1)
        self.assertEqual(answer['comment_id'], comment['id'])
        self.assertEqual(answer['content'], self.ANSWER_1['content'])
        self.assertEqual(answer['likes_count'], 0)
