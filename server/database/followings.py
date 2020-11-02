from .tables import Table

class Followings(Table):

    def follow(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO followings
        (follower_id, followed_id)
        VALUES
        (%(follower_id)s, %(followed_id)s)
        ''', kwargs)
    
    def unfollow(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM followings
        WHERE follower_id = %(follower_id)s
        AND followed_id = %(followed_id)s
        ''', kwargs)
    
    def get_feed(self, **kwargs):
        return self._database.fetch_all('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM post_likes
            WHERE user_id = id
        ), (
            SELECT count(*) AS comments_count
            FROM comments
            WHERE post_id = id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM posts
        INNER JOIN followings
        ON author_id = followed_id
        WHERE follower_id = %(follower_id)s
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        ''', kwargs)
    
    def count_feed(self, **kwargs):
        return self._database.fetch_one('''
        SELECT count(*) AS total_count FROM posts
        INNER JOIN followings
        ON author_id = followed_id
        WHERE follower_id = %(follower_id)s
        ''', kwargs)

    def get_followings(self, **kwargs):
        return self._database.fetch_all('''
        SELECT followed_id, u.login, p.photo_url
        FROM followings
        INNER JOIN users AS u
        ON followed_id = u.id
        INNER JOIN profiles AS p
        ON followed_id = p.user_id
        WHERE follower_id = %(follower_id)s
        ''', kwargs)
        