from .tables import AuthorContentTable

class Answers(AuthorContentTable):

    metadata = {
        'table': 'answers',
        'model': 'answer',
        'foreign_key': 'comment_id'
    }

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM {model}_likes
            WHERE id = {model}_id
        )
        FROM {table}
        WHERE id = %(id)s
        '''.format(**self.metadata), kwargs)

    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM {model}_likes
            WHERE id = {model}_id
        ) FROM {table}
        {condition}
        ORDER BY created DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(**self.metadata, condition=self.params_to_condition(**kwargs)), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO {table}
        (author_id, {foreign_key}, content)
        VALUES
        (%(author_id)s, %({foreign_key})s, %(content)s)
        RETURNING *,
        (SELECT 0 AS likes_count)
        '''.format(**self.metadata), kwargs)
