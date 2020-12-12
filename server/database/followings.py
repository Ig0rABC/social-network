from .tables import Table

class Followings(Table):

    def follow():
        return '''
        INSERT INTO followings
        (follower_id, user_id)
        VALUES
        (%(follower_id)s, %(user_id)s)
        '''
    
    def unfollow():
        return '''
        DELETE FROM followings
        WHERE follower_id = %(follower_id)s
        AND user_id = %(user_id)s
        '''
    
    def feed():
        return '''
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
        ON author_id = user_id
        WHERE follower_id = %(follower_id)s
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''
    
    def feed_count():
        return '''
        SELECT count(*) AS total_count FROM posts
        INNER JOIN followings
        ON author_id = user_id
        WHERE follower_id = %(follower_id)s
        '''

    def get_followings():
        return '''
        SELECT id, login, photo_url
        FROM users
        INNER JOIN followings
        ON id = followings.user_id
        INNER JOIN profiles
        ON id = profiles.user_id
        WHERE follower_id = %(follower_id)s
        '''