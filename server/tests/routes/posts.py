import requests
import json
import unittest
from database import Database

class PostTests(unittest.TestCase):

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
    POST_3_PAYLOAD = {
        'category': 'No category',
        'content': 'dajdajpkopewkt['
    }
    POST_4_PAYLOAD = {
        'category': 'Programming',
        'content': 'JavaScript'
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
    
    def like_post(self, session, payload):
        return session.post('http://localhost:5000/posts/likes', params=payload)
    
    def unlike_post(self, session, payload):
        return session.delete('http://localhost:5000/posts/likes', params=payload)
    
    def count_post_likes(self, payload):
        return requests.get('http://localhost:5000/posts/likes', params=payload)

    def test_get_categories(self):
        response = requests.get('http://localhost:5000/posts/categories')
        self.assertEqual(response.status_code, 200)

    def test_create_post(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
        post = json.loads(response.content)
        self.assertEqual(post['id'], 1)
        self.assertEqual(post['authorId'], 1)
        self.assertIn('created', post)
        self.assertEqual(post['category'], self.POST_1_PAYLOAD['category'])
        self.assertEqual(post['content'], self.POST_1_PAYLOAD['content'])
        self.assertEqual(post['likesCount'], 0)
    
    def test_create_post_not_logged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        response = self.create_post(session, self.POST_1_PAYLOAD)
        self.assertEqual(response.status_code, 401)

    def test_get_posts_by_author_id(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.create_post(session, self.POST_2_PAYLOAD)
        self.logout_user(session)
        self.login_user(session, self.USER_2_PAYLOAD)
        self.create_post(session, self.POST_3_PAYLOAD)
        response = self.get_posts({
            'authorId': 1,
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        posts = data['posts']
        self.assertEqual(len(posts), 2)
    
    def test_get_posts_by_category(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.create_post(session, self.POST_2_PAYLOAD)
        self.logout_user(session)
        self.login_user(session, self.USER_2_PAYLOAD)
        self.create_post(session, self.POST_3_PAYLOAD)
        self.create_post(session, self.POST_4_PAYLOAD)
        payload = {
            'category': 'Programming'
        }
        response = self.get_posts(payload)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        posts = data['posts']
        self.assertEqual(len(posts), 2)
        self.assertEqual(posts[0]['category'], payload['category'])
        self.assertEqual(posts[0]['content'], self.POST_4_PAYLOAD['content'])
        self.assertEqual(posts[0]['authorId'], 2)
        self.assertEqual(posts[1]['category'], payload['category'])
        self.assertEqual(posts[1]['content'], self.POST_1_PAYLOAD['content'])
        self.assertEqual(posts[1]['authorId'], 1)

    def test_get_posts_by_category_and_author_id(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.create_post(session, self.POST_4_PAYLOAD)
        self.create_post(session, self.POST_2_PAYLOAD)
        self.logout_user(session)
        self.login_user(session, self.USER_2_PAYLOAD)
        self.create_post(session, self.POST_3_PAYLOAD)
        self.create_post(session, self.POST_4_PAYLOAD)
        payload = {
            'category': self.POST_1_PAYLOAD['category'],
            'authorId': 1
        }
        response = self.get_posts(payload)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        posts = data['posts']
        self.assertEqual(len(posts), 2)
        self.assertEqual(posts[0]['category'], payload['category'])
        self.assertEqual(posts[0]['authorId'], payload['authorId'])
        self.assertEqual(posts[1]['category'], payload['category'])
        self.assertEqual(posts[1]['authorId'], payload['authorId'])

    def test_update_post_by_author(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        post_payload = self.POST_2_PAYLOAD.copy()
        post_payload['id'] = 1
        response = self.update_post(session, post_payload)
        self.assertEqual(response.status_code, 200)
        post = json.loads(response.content)
        self.assertEqual(post['category'], self.POST_1_PAYLOAD['category'])
        self.assertEqual(post['content'], self.POST_2_PAYLOAD['content'])

    def test_update_post_not_by_author(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.logout_user(session)
        self.register_user(self.USER_2_PAYLOAD)
        self.login_user(session, self.USER_2_PAYLOAD)
        post_payload = self.POST_2_PAYLOAD.copy()
        post_payload['id'] = 1
        response = self.update_post(session, post_payload)
        self.assertEqual(response.status_code, 401)

    def test_update_post_not_logged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.logout_user(session)
        post_payload = self.POST_2_PAYLOAD.copy()
        post_payload['id'] = 1
        response = self.update_post(session, post_payload)
        self.assertEqual(response.status_code, 401)
    
    def test_delete_post_by_author(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        post_data = json.loads(response.content)
        response = self.delete_post(session, post_data)
        self.assertEqual(response.status_code, 205)

    def test_delete_post_not_by_author(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        post_data = json.loads(response.content)
        self.logout_user(session)
        self.login_user(session, self.USER_2_PAYLOAD)
        response = self.delete_post(session, post_data)
        self.assertEqual(response.status_code, 401)

    def test_delete_post_not_logged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        post_data = json.loads(response.content)
        self.logout_user(session)
        response = self.delete_post(session, post_data)
        self.assertEqual(response.status_code, 401)

    def test_like_post(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        post_data = json.loads(response.content)
        response = self.like_post(session, {'post_id': post_data['id']})
        self.assertEqual(response.status_code, 200)
    
    def test_like_post_not_logged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        post_data = json.loads(response.content)
        self.logout_user(session)
        response = self.like_post(session, {'post_id': post_data['id']})
        self.assertEqual(response.status_code, 401)
'''
    def test_count_post_likes(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        data = json.loads(response.content)
        post_id = data['id']
        payload = {'postId': post_id}
        self.like_post(session, payload)
        self.logout_user(session)
        response = self.count_post_likes(payload)
        data = json.loads(response.content)
        self.assertEqual(data['likesCount'], 1)
        self.login_user(session, self.USER_2_PAYLOAD)
        self.like_post(session, payload)
        response = self.count_post_likes(payload)
        data = json.loads(response.content)
        self.assertEqual(data['likesCount'], 2)

    def test_unlike_post(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = requests.Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        response = self.create_post(session, self.POST_1_PAYLOAD)
        post = json.loads(response.content)
'''