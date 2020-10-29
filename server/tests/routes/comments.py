import requests
import json
import unittest
from database import Database

class CommentsTests(unittest.TestCase):
    
    USER_1_PAYLOAD = {
        'login': 'testUser1',
        'password': 'testPassword1'
    }
    USER_2_PAYLOAD = {
        'login': 'testUser2',
        'password': 'testPassword2'
    }
    POST_1_PAYLOAD = {
        'category': 'Programming',
        'content': 'python'
    }
    POST_2_PAYLOAD = {
        'category': 'Travels',
        'content': 'New Zealand'
    }
    COMMENT_1_PAYLOAD = {
        'post_id': 1,
        'content': 'fjidsjf'
    }
    COMMENT_2_PAYLOAD = {
        'post_id': 2,
        'content': 'ggj;jsfk'
    }

    def tearDown(self):
        Database(dbname='socialnetwork').clear()

    def register_user(self, payload):
        return requests.post('http://localhost:5000/users/register', params=payload)
    
    def login_user(self, session, payload):
        return session.post('http://localhost:5000/users/login', params=payload)
    
    def logout_user(self, session):
        return session.delete('http://localhost:5000/users/login')
    
    def create_post(self, session, payload):
        return session.post('http://localhost:5000/posts', params=payload)
    
    def update_post(self, session, payload):
        return session.put('http://localhost:5000/posts', params=payload)
    
    def get_posts(self, payload):
        return requests.get('http://localhost:5000/posts', params=payload)
    
    def delete_post(self, session, payload):
        return session.delete('http://localhost:5000/posts', params=payload)
    
    def create_comment(self, session, payload):
        return session.post('http://localhost:5000/comments', params=payload)
    
    def get_comments(self, payload):
        return requests.get('http://localhost:5000/comments', params=payload)

    def test_create_comment(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        response = self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
        comment = json.loads(response.content)
        self.assertEqual(comment['id'], 1)
        self.assertEqual(comment['authorId'], 1)
        self.assertEqual(comment['postId'], self.COMMENT_1_PAYLOAD['post_id'])
        self.assertEqual(comment['content'], self.COMMENT_1_PAYLOAD['content'])
    
    def test_create_comment_not_logged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.logout_user(session)
        response = self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.assertEqual(response.status_code, 401)

    def test_get_comments_by_author_id(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.logout_user(session)
        self.login_user(session, self.USER_2_PAYLOAD)
        self.create_post(session, self.POST_2_PAYLOAD)
        self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.create_comment(session, self.COMMENT_2_PAYLOAD)
        self.create_comment(session, self.COMMENT_2_PAYLOAD)
        response = self.get_comments({
            'authorId': 2,
            'limit': 2
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data['comments']), 2)
        self.assertEqual(data['totalCount'], 3)

    def test_get_comments_by_post_id(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.logout_user(session)
        self.login_user(session, self.USER_2_PAYLOAD)
        self.create_post(session, self.POST_2_PAYLOAD)
        self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.create_comment(session, self.COMMENT_2_PAYLOAD)
        response = self.get_comments({
            'post_id': 1
        })
        data = json.loads(response.content)
        self.assertEqual(len(data['comments']), 2)
        response = self.get_comments({
            'post_id': 2
        })
        data = json.loads(response.content)
        self.assertEqual(len(data['comments']), 1)
