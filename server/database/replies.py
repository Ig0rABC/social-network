from .tables import AuthorContentTable

class Replies(AuthorContentTable):

    metadata = {
        'table': 'replies',
        'model': 'reply',
        'foreign_key': 'comment_id'
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
        ) FROM replies
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=self.params_to_condition(**kwargs)), kwargs)

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
        RETURNING replies.*,
        (SELECT login FROM users WHERE users.id = %(author_id)s),
        (SELECT photo_url FROM profiles WHERE user_id = %(author_id)s),
        (SELECT 0 AS likes_count)
        '''.format(**self.metadata), kwargs)