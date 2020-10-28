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
    POST_2 = {
        'category': 'Travels',
        'content': 'New Zealand'
    }
    COMMENT_1 = {
        'post_id': 1,
        'content': 'daskdoak'
    }
    COMMENT_2 = {
        'post_id': 2,
        'content': 'fsdfdmfr'
    }

    def tearDown(self):
        Database(dbname='socialnetwork').clear()
    
    def test_create_comment(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        comment = database.comments.create(author_id=1, **self.COMMENT_1)
        self.assertEqual(comment['id'], 1)
        self.assertEqual(comment['author_id'], 1)
        self.assertEqual(comment['post_id'], self.COMMENT_1['post_id'])
        self.assertEqual(comment['content'], self.COMMENT_1['content'])
        self.assertEqual(comment['likes_count'], 0)

    def test_get_comments_by_author(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        database.comments.create(author_id=2, **self.COMMENT_1)
        comments = database.comments.filter(author_id=1, limit=10, offset=0)
        self.assertEqual(len(comments), 2)
        comments = database.comments.filter(author_id=2, limit=10, offset=0)
        self.assertEqual(len(comments), 1)

    def test_get_comments_by_post(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=2, **self.POST_2)
        database.comments.create(author_id=1, **self.COMMENT_2)
        database.comments.create(author_id=1, **self.COMMENT_2)
        database.comments.create(author_id=2, **self.COMMENT_1)
        comments = database.comments.filter(post_id=1, limit=10, offset=0)
        self.assertEqual(len(comments), 1)
        comments = database.comments.filter(post_id=2, limit=10, offset=0)
        self.assertEqual(len(comments), 2)
    
    def test_get_comments_by_post_and_author(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=2, **self.POST_2)
        database.comments.create(author_id=1, **self.COMMENT_2)
        database.comments.create(author_id=2, **self.COMMENT_2)
        database.comments.create(author_id=2, **self.COMMENT_1)
        comments = database.comments.filter(post_id=2, author_id=1, limit=10, offset=0)
        self.assertEqual(len(comments), 1)
    
    def test_update_comment(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        comment = database.comments.update(id=1, **self.COMMENT_2)
        self.assertEqual(comment['post_id'], self.COMMENT_1['post_id'])
        self.assertEqual(comment['content'], self.COMMENT_2['content'])

    def test_delete_comment(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        database.comments.delete(id=1)
        comments = database.comments.filter(author_id=1, limit=10, offset=0)
        self.assertEqual(len(comments), 0)
    
    def test_like_comment(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        database.comments.create(author_id=2, **self.COMMENT_1)
        database.comments.like(comment_id=1, user_id=1)
        data = database.comments.count_likes(comment_id=1)
        self.assertEqual(data['likes_count'], 1)
        database.comments.like(comment_id=1, user_id=2)
        data = database.comments.count_likes(comment_id=1)
        self.assertEqual(data['likes_count'], 2)
        data = database.comments.count_likes(comment_id=2)
        self.assertEqual(data['likes_count'], 0)

    def test_unlike_comment(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        database.comments.like(comment_id=1, user_id=1)
        database.comments.unlike(comment_id=1, user_id=1)
        data = database.comments.count_likes(comment_id=1)
        self.assertEqual(data['likes_count'], 0)

    def test_twice_like_comment(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.comments.create(author_id=1, **self.COMMENT_1)
        database.comments.like(comment_id=1, user_id=1)
        database.comments.like(comment_id=1, user_id=1)
        data = database.comments.count_likes(comment_id=1)
        self.assertEqual(data['likes_count'], 1)
