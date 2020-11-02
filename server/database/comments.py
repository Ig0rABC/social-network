from .tables import AuthorContentTable

class Comments(AuthorContentTable):

    metadata = {
        'table': 'comments',
        'model': 'comment',
        'foreign_key': 'post_id',
    }

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT comments.*, (
            SELECT count(*) AS likes_count
            FROM comment_likes
            WHERE id = comment_id
        ), (
            SELECT count(*) AS answers_count
            FROM answers
            WHERE comment_id = id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM comments
        WHERE id = %(id)s
        ''', kwargs)

    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT comments.*, (
            SELECT count(*) AS likes_count
            FROM comment_likes
            WHERE id = comment_id
        ), (
            SELECT count(*) AS answers_count
            FROM answers
            WHERE comment_id = id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM comments
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=self.params_to_condition(**kwargs)), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO comments
        (author_id, post_id, content)
        VALUES
        (%(author_id)s, %(post_id)s, %(content)s)
        RETURNING *,
        (SELECT 0 AS likes_count),
        (SELECT 0 AS answers_count)
        ''', kwargs)
