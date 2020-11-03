from ..test_cases import TestCaseWithUsers
from settings import database

class CommentsDatabase(TestCaseWithUsers):

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
    REPLY_1 = {
        'comment_id': 1,
        'content': '523040'
    }
    REPLY_2 = {
        'comment_id': 2,
        'content': '98520'
    }
    
    def test_create_reply(self):
        self.register_user(self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        comment = database.comments.create(author_id=1, **self.COMMENT_1)
        reply = database.replies.create(author_id=1, **self.REPLY_1)
        self.assertEqual(reply['id'], 1)
        self.assertEqual(reply['author_id'], 1)
        self.assertEqual(reply['comment_id'], comment['id'])
        self.assertEqual(reply['content'], self.REPLY_1['content'])
        self.assertEqual(reply['likes_count'], 0)
