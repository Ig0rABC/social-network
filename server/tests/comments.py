import json
from requests import Session
from .test_cases import CommentsTestCase

class CommentsTests(CommentsTestCase):

    def test_create_comment(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        response = self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.assertEqual(response.status_code, 201)
        comment = json.loads(response.content)
        self.assertEqual(comment['id'], 1)
        self.assertEqual(comment['author']['id'], 1)
        self.assertEqual(comment['postId'], self.COMMENT_1_PAYLOAD['post_id'])
        self.assertEqual(comment['content'], self.COMMENT_1_PAYLOAD['content'])
    
    def test_create_comment_not_logged(self):
        self.register_user(self.USER_1_PAYLOAD)
        session = Session()
        self.login_user(session, self.USER_1_PAYLOAD)
        self.create_post(session, self.POST_1_PAYLOAD)
        self.logout_user(session)
        response = self.create_comment(session, self.COMMENT_1_PAYLOAD)
        self.assertEqual(response.status_code, 401)

    def test_get_comments_by_author_id(self):
        self.register_user(self.USER_1_PAYLOAD)
        self.register_user(self.USER_2_PAYLOAD)
        session = Session()
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
        session = Session()
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
