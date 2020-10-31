from .tables import AuthorContentTable

class Comments(AuthorContentTable):

    metadata = {
        'table': 'comments',
        'model': 'comment',
        'foreign_key': 'post_id',
    }

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM {model}_likes
            WHERE id = {model}_id
        ), (
            SELECT count(*) AS answers_count
            FROM answers
            WHERE {model}_id = id
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
        ), (
            SELECT count(*) AS answers_count
            FROM answers
            WHERE {model}_id = id
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
        (SELECT 0 AS likes_count),
        (SELECT 0 AS answers_count)
        '''.format(**self.metadata), kwargs)
