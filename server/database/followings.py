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
        ) FROM posts
        INNER JOIN followings
        ON author_id = followed_id
        WHERE follower_id = %(follower_id)s
        ORDER BY created DESC
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
        return [
            row['followed_id']
            for row in self._database.fetch_all('''
            SELECT followed_id FROM followings
            WHERE follower_id = %(follower_id)s
            ''', kwargs)
        ]