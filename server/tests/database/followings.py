from ..test_case import TestCaseWithDBClear
from settings import database

class FollowingsDatabase(TestCaseWithDBClear):

    USER_1 = {
        'login': 'testUser1',
        'password': 'testPassword1'
    }
    USER_2 = {
        'login': 'testUser2',
        'password': 'testPassword2'
    }
    USER_3 = {
        'login': 'testUser3',
        'password': 'testPassword3'
    }
    POST_1 = {
        'category': 'Programming',
        'content': 'python'
    }
    POST_2 = {
        'category': 'Travels',
        'content': 'New Zealand'
    }
    POST_3 = {
        'category': 'No category',
        'content': 'dajdajpkopewkt['
    }
    POST_4 = {
        'category': 'Programming',
        'content': 'JavaScript'
    }
    
    def test_follow_user(self):
        follower_id = database.users.register(**self.USER_1)['user_id']
        followed_id = database.users.register(**self.USER_2)['user_id']
        database.followings.follow(follower_id=follower_id, followed_id=followed_id)
        followings = database.followings.get_followings(follower_id=follower_id)
        self.assertEqual(len(followings), 1)
        self.assertIn(2, followings)
    
    def test_unfollow_user(self):
        follower_id = database.users.register(**self.USER_1)['user_id']
        followed_id = database.users.register(**self.USER_2)['user_id']
        database.followings.follow(follower_id=follower_id, followed_id=followed_id)
        database.followings.unfollow(follower_id=follower_id, followed_id=followed_id)
        followings = database.followings.get_followings(follower_id=follower_id)
        self.assertFalse(followings)
    
    def test_get_feed(self):
        follower_id = database.users.register(**self.USER_1)['user_id']
        followed_id = database.users.register(**self.USER_2)['user_id']
        no_followed_id = database.users.register(**self.USER_3)['user_id']
        database.posts.create(author_id=followed_id, **self.POST_1)
        database.posts.create(author_id=followed_id, **self.POST_2)
        database.posts.create(author_id=no_followed_id, **self.POST_3)
        database.posts.create(author_id=follower_id, **self.POST_4)
        database.followings.follow(follower_id=follower_id, followed_id=followed_id)
        feed = database.followings.get_feed(follower_id=follower_id, limit=10, offset=0)
        self.assertEqual(len(feed), 2)
