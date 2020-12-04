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

    def get(self, **kwargs):
        return self._database.fetch_one('''
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
        '''.format(**self.metadata), kwargs)

    def filter(self, **kwargs):
        condition = kwargs.copy()
        condition.pop('user_id', None)
        if kwargs.get('content', None):
            kwargs['content'] = '%' + kwargs['content'] + '%'
        return self._database.fetch_all('''
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
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=self.build_condition(**condition)), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO replies
        (author_id, {foreign_key}, content)
        VALUES
        (%(author_id)s, %({foreign_key})s, %(content)s)
        RETURNING replies.*,
        (SELECT login FROM users WHERE users.id = %(author_id)s),
        (SELECT photo_url FROM profiles WHERE user_id = %(author_id)s),
        (SELECT 0 AS likes_count)
        '''.format(**self.metadata), kwargs)


    def update(self, **kwargs):
        return self._database.execute_with_returning('''
        UPDATE {table}
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
        '''.format(**self.metadata), kwargs)