import json
import requests
import unittest
from psycopg2 import connect
from settings import DSN


BASE_URL = 'http://localhost:5000/'


class TestCaseWithDBClear(unittest.TestCase):

    def clear(self):
        tables = [
            'tokens',
            'reply_likes',
            'comment_likes',
            'post_likes',
            'replies',
            'comments',
            'posts',
            'contacts',
            'profiles',
            'messages',
            'followings',
            'chats_members',
            'chats',
            'users',
        ]
        sequences = [
            'replies',
            'comments',
            'posts',
            'messages',
            'chats',
            'users',
        ]
        with connect(DSN) as connection:
            with connection.cursor() as cursor:
                for table in tables:
                    cursor.execute(f'DELETE FROM {table}')
                for seq in sequences:
                    cursor.execute(
                        f'ALTER SEQUENCE {seq}_id_seq RESTART WITH 1'
                    )
    
    def setUp(self):
        self.clear()

    def tearDown(self):
        self.clear()


class UsersTestCase(TestCaseWithDBClear):

    USER_1_PAYLOAD = {
        'login': 'testUser1',
        'password': 'testPassword1'
    }
    USER_2_PAYLOAD = {
        'login': 'testUser2',
        'password': 'testPassword2'
    }

    def register_user(self, payload):
        return requests.post(BASE_URL + 'users/register', data=json.dumps(payload))

    def login_user(self, session, payload):
        return session.post(BASE_URL + 'users/login', data=json.dumps({'remember_me': True, **payload}))

    def logout_user(self, session):
        return session.delete(BASE_URL + 'users/login')


class PostsTestCase(UsersTestCase):

    POST_1_PAYLOAD = {
        'category': 'programming',
        'content': 'python'
    }
    POST_2_PAYLOAD = {
        'category': 'travels',
        'content': 'New Zealand'
    }
    POST_3_PAYLOAD = {
        'category': 'no category',
        'content': 'dajdajpkopewkt['
    }
    POST_4_PAYLOAD = {
        'category': 'programming',
        'content': 'JavaScript'
    }

    def create_post(self, session, payload):
        return session.post(BASE_URL + 'posts', data=json.dumps(payload))

    def update_post(self, session, post_id, payload):
        return session.put(BASE_URL + 'posts/' + str(post_id), data=json.dumps(payload))

    def get_posts(self, payload):
        return requests.get(BASE_URL + 'posts', params=payload)

    def delete_post(self, session, post_id):
        return session.delete(BASE_URL + 'posts/' + str(post_id))

    def like(self, session, payload):
        return session.post(BASE_URL + 'likes', params=payload)

    def unlike(self, session, payload):
        return session.delete(BASE_URL + 'likes', params=payload)


class CommentsTestCase(PostsTestCase):

    COMMENT_1_PAYLOAD = {
        'post_id': 1,
        'content': 'fjidsjf'
    }
    COMMENT_2_PAYLOAD = {
        'post_id': 2,
        'content': 'ggj;jsfk'
    }

    def create_comment(self, session, payload):
        return session.post(BASE_URL + 'comments', data=json.dumps(payload))

    def get_comments(self, payload):
        return requests.get(BASE_URL + 'comments', params=payload)
