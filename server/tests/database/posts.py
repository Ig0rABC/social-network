from ..test_case import TestCaseWithDBClear
from settings import database

class PostsDatabase(TestCaseWithDBClear):

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
    POST_3 = {
        'category': 'No category',
        'content': 'dajdajpkopewkt['
    }
    POST_4 = {
        'category': 'Programming',
        'content': 'JavaScript'
    }
    
    def test_create_post(self):
        data = database.users.register(**self.USER_1)
        user_id = data['user_id']
        post = database.posts.create(author_id=user_id, **self.POST_1)
        self.assertEqual(post['id'], 1)
        self.assertEqual(post['category'], self.POST_1['category'])
        self.assertEqual(post['content'], self.POST_1['content'])
        self.assertEqual(post['likes_count'], 0)
    
    def test_update_post(self):
        data = database.users.register(**self.USER_1)
        user_id = data['user_id']
        data = database.posts.create(author_id=user_id, **self.POST_1)
        data = database.posts.update(id=data['id'], **self.POST_2)
        self.assertEqual(data['category'], self.POST_1['category'])
        self.assertEqual(data['content'], self.POST_2['content'])
    
    def test_filter_posts_by_author(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=1, **self.POST_2)
        database.posts.create(author_id=1, **self.POST_3)
        database.posts.create(author_id=2, **self.POST_4)
        posts = database.posts.filter(author_id=1, limit=3, offset=0)
        self.assertEqual(len(posts), 3)
        posts = database.posts.filter(author_id=1, limit=2, offset=0)
        self.assertEqual(len(posts), 2)
        posts = database.posts.filter(author_id=2, limit=10, offset=0)
        self.assertEqual(len(posts), 1)
    
    def test_filter_posts_by_category(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=1, **self.POST_2)
        database.posts.create(author_id=1, **self.POST_3)
        database.posts.create(author_id=2, **self.POST_4)
        posts = database.posts.filter(category=self.POST_1['category'], limit=3, offset=0)
        self.assertEqual(len(posts), 2)
        self.assertEqual(posts[0]['author_id'], 2)
        self.assertEqual(posts[1]['author_id'], 1)

    def test_filter_posts_by_category_and_author(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=1, **self.POST_2)
        database.posts.create(author_id=1, **self.POST_3)
        database.posts.create(author_id=2, **self.POST_4)
        posts = database.posts.filter(author_id=1, category=self.POST_1['category'], limit=3, offset=0)
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]['author_id'], 1)
    
    def test_get_post_total_count(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=1, **self.POST_2)
        database.posts.create(author_id=1, **self.POST_3)
        database.posts.create(author_id=1, **self.POST_4)
        data = database.posts.count(author_id=1, category=self.POST_1['category'])
        self.assertEqual(data['total_count'], 2)
    
    def test_delete_post(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=1, **self.POST_2)
        database.posts.create(author_id=1, **self.POST_3)
        database.posts.delete(id=1)
        posts = database.posts.filter(author_id=1, limit=10, offset=0)
        self.assertEqual(len(posts), 2)
    
    def test_like_post(self):
        database.users.register(**self.USER_1)
        database.users.register(**self.USER_2)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.create(author_id=2, **self.POST_2)
        database.posts.like(post_id=1, user_id=1)
        data = database.posts.count_likes(post_id=1)
        self.assertEqual(data['likes_count'], 1)
        database.posts.like(post_id=1, user_id=2)
        data = database.posts.count_likes(post_id=1)
        self.assertEqual(data['likes_count'], 2)
        data = database.posts.count_likes(post_id=2)
        self.assertEqual(data['likes_count'], 0)

    def test_unlike_post(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.like(post_id=1, user_id=1)
        database.posts.unlike(post_id=1, user_id=1)
        data = database.posts.count_likes(post_id=1)
        self.assertEqual(data['likes_count'], 0)

    def test_twice_like_post(self):
        database.users.register(**self.USER_1)
        database.posts.create(author_id=1, **self.POST_1)
        database.posts.like(post_id=1, user_id=1)
        database.posts.like(post_id=1, user_id=1)
        data = database.posts.count_likes(post_id=1)
        self.assertEqual(data['likes_count'], 1)
