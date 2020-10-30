import requests
from ..test_case import TestCaseWithDBClear

BASE_URL = 'http://localhost:5000/'

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
        return requests.post(BASE_URL + '/users/register', params=payload)
    
    def login_user(self, session, payload):
        return session.post(BASE_URL + '/users/login', params=payload)
    
    def logout_user(self, session):
        return session.delete(BASE_URL + '/users/login')

class PostsTestCase(UsersTestCase):

    URL = BASE_URL + 'posts'

    POST_1_PAYLOAD = {
        'category': 'Programming',
        'content': 'python'
    }
    POST_2_PAYLOAD = {
        'category': 'Travels',
        'content': 'New Zealand'
    }
    POST_3_PAYLOAD = {
        'category': 'No category',
        'content': 'dajdajpkopewkt['
    }
    POST_4_PAYLOAD = {
        'category': 'Programming',
        'content': 'JavaScript'
    }

    def test_get_categories(self):
        response = requests.get(BASE_URL + '/posts/categories')
        self.assertEqual(response.status_code, 200)
    
    def create_post(self, session, payload):
        return session.post(BASE_URL + '/posts', params=payload)
    
    def update_post(self, session, payload):
        return session.put(BASE_URL + '/posts', params=payload)
    
    def get_posts(self, payload):
        return requests.get(BASE_URL + '/posts', params=payload)
    
    def delete_post(self, session, payload):
        return session.delete(BASE_URL + '/posts', params=payload)
    
    def like(self, session, payload):
        return session.post(self.URL + '/likes', params=payload)
    
    def unlike(self, session, payload):
        return session.delete(self.URL + '/likes', params=payload)
    
    def count_likes(self, payload):
        return requests.get(self.URL + '/likes', params=payload)
    
class CommentsTestCase(PostsTestCase):

    URL = BASE_URL + 'comments'
    COMMENT_1_PAYLOAD = {
        'post_id': 1,
        'content': 'fjidsjf'
    }
    COMMENT_2_PAYLOAD = {
        'post_id': 2,
        'content': 'ggj;jsfk'
    }
    
    def create_comment(self, session, payload):
        return session.post(BASE_URL + '/comments', params=payload)
    
    def get_comments(self, payload):
        return requests.get(BASE_URL + '/comments', params=payload)