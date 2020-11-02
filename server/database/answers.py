from .tables import AuthorContentTable

class Answers(AuthorContentTable):

    metadata = {
        'table': 'answers',
        'model': 'answer',
        'foreign_key': 'comment_id'
    }

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT answers.*, (
            SELECT count(*) AS likes_count
            FROM answer_likes
            WHERE id = answer_id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM answers
        INNER JOIN users
        ON author_id = users.id
        INNER JOIN profiles
        ON author_id = profiles.user_id
        WHERE answers.id = %(id)s
        '''.format(**self.metadata), kwargs)

    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT answers.*, (
            SELECT count(*) AS likes_count
            FROM answer_likes
            WHERE id = answer_id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM answers
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=self.params_to_condition(**kwargs)), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO answers
        (author_id, {foreign_key}, content)
        VALUES
        (%(author_id)s, %({foreign_key})s, %(content)s)
        RETURNING *,
        (SELECT 0 AS likes_count)
        '''.format(**self.metadata), kwargs)
