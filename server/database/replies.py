from .tables import AuthorContentTable


class Replies(AuthorContentTable):

    metadata = {
        'table': 'replies',
        'model': 'reply',
        'foreign_key': 'comment_id',
        'searchable': [
            'content'
        ]
    }

    def get():
        return '''
        SELECT replies.*, (
            SELECT count(*) AS likes_count
            FROM reply_likes
            WHERE id = reply_id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM replies
        INNER JOIN users
        ON author_id = users.id
        INNER JOIN profiles
        ON author_id = profiles.user_id
        WHERE replies.id = %(id)s
        '''

    @classmethod
    def filter(cls, **kwargs):
        kwargs.pop('user_id', None)
        return '''
        SELECT replies.*, (
            SELECT count(*) AS likes_count
            FROM reply_likes
            WHERE id = reply_id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ), (
            SELECT exists(
                SELECT true FROM reply_likes
                WHERE reply_likes.user_id = %(user_id)s
                AND reply_likes.reply_id = replies.id
            ) AS is_liked
        ) FROM replies
        {0}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(cls.build_condition(**kwargs))

    def create():
        return '''
        INSERT INTO replies
        (author_id, comment_id, content)
        VALUES
        (%(author_id)s, %(comment_id))s, %(content)s)
        RETURNING replies.*,
        (SELECT login FROM users WHERE users.id = %(author_id)s),
        (SELECT photo_url FROM profiles WHERE user_id = %(author_id)s),
        (SELECT 0 AS likes_count)
        '''

    def update():
        return '''
        UPDATE replies
        SET content = %(content)s
        WHERE id = %(id)s
        RETURNING replies.*, (
            SELECT login FROM users
            INNER JOIN comments
            ON users.id = comments.author_id
            WHERE comments.id = %(id)s
        ), (
            SELECT photo_url FROM profiles
            INNER JOIN comments
            ON profiles.user_id = comments.author_id
            WHERE comments.id = %(id)s
        ),
        (SELECT 0 AS likes_count)
        '''
