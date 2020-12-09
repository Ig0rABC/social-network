from .tables import AuthorContentTable

class Comments(AuthorContentTable):

    metadata = {
        'table': 'comments',
        'model': 'comment',
        'foreign_key': 'post_id',
        'searchable': [
            'content'
        ]
    }

    def get():
        return '''
        SELECT comments.*, (
            SELECT count(*) AS likes_count
            FROM comment_likes
            WHERE id = comment_id
        ), (
            SELECT count(*) AS replies_count
            FROM replies
            WHERE comment_id = id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM comments
        WHERE id = %(id)s
        '''

    @classmethod
    def filter(cls, **kwargs):
        return '''
        SELECT comments.*, (
            SELECT count(*) AS likes_count
            FROM comment_likes
            WHERE id = comment_id
        ), (
            SELECT count(*) AS replies_count
            FROM replies
            WHERE comment_id = comments.id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ), (
            SELECT exists(
                SELECT true FROM comment_likes
                WHERE comment_likes.user_id = %(user_id)s
                AND comment_likes.comment_id = comments.id
            ) AS is_liked
        )FROM comments
        {0}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(cls.build_condition(**kwargs))

    def create():
        return '''
        INSERT INTO comments
        (author_id, post_id, content)
        VALUES
        (%(author_id)s, %(post_id)s, %(content)s)
        RETURNING comments.*,
        (SELECT login FROM users WHERE users.id = %(author_id)s),
        (SELECT photo_url FROM profiles WHERE user_id = %(author_id)s),
        (SELECT 0 AS likes_count),
        (SELECT 0 AS replies_count)
        '''

    def update():
        return '''
        UPDATE comments
        SET content = %(content)s
        WHERE id = %(id)s
        RETURNING comments.*, (
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
        (SELECT 0 AS likes_count),
        (SELECT 0 AS comments_count)
        '''
