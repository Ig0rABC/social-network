class Table:

    def __init__(self, database):
        self._database = database
    
    def params_to_condition(self, params):
        if not params:
            return ''
        return 'WHERE ' + ' AND '.join(
            f'{key} = %({key})s'
            for key in params.keys()
        )
    
    def params_to_update(self, params):
        if not params:
            return ''
        return 'SET ' + ', '.join(
            f'{key} = %({key})s'
            for key in params.keys()
        )

class UserInfoTable(Table):

    table = None

    def create(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO {0} (user_id)
        VALUES (%(user_id)s)
        '''.format(self.table), kwargs)

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT * FROM {0}
        WHERE user_id = %(user_id)s
        '''.format(self.table), kwargs)
    
    def update(self, **kwargs):
        self._database.execute_and_commit('''
        UPDATE {0}
        {1}
        WHERE user_id = %(user_id)s
        '''.format(self.table, self.params_to_update(kwargs)), kwargs)

class AuthorContentTable(Table):

    metadata = {
        'table': None,
        'model': None,
        'foreign_key': None
    }

    def filter(self, **kwargs):
        params = kwargs.copy()
        params.pop('limit')
        params.pop('offset')
        return self._database.fetch_all('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM {model}_likes
            WHERE id = user_id
        ) FROM {table}
        {condition}
        ORDER BY created DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(**self.metadata,condition=self.params_to_condition(params)), kwargs)
    
    def count(self, **kwargs):
        return self._database.fetch_one('''
        SELECT count(*) AS total_count FROM {table}
        {condition}
        '''.format(**self.metadata, condition=self.params_to_condition(kwargs)), kwargs)

    def get_author_id(self, **kwargs):
        return self._database.fetch_one('''
        SELECT author_id FROM {table}
        WHERE id = %(id)s
        '''.format(**self.metadata), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO {table}
        (author_id, {foreign_key}, content)
        VALUES
        (%(author_id)s, %({foreign_key})s, %(content)s)
        RETURNING *, (SELECT 0 AS likes_count)
        '''.format(**self.metadata), kwargs)
    
    def update(self, **kwargs):
        return self._database.execute_with_returning('''
        UPDATE {table}
        SET content = %(content)s
        WHERE id = %(id)s
        RETURNING *
        '''.format(**self.metadata), kwargs)

    def delete(self, **kwargs):
        return self._database.execute_and_commit('''
        DELETE FROM {table}
        WHERE id = %(id)s
        '''.format(**self.metadata), kwargs)

    def like(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO {model}_likes
        (user_id, {model}_id)
        VALUES
        (%(user_id)s, %({model}_id)s)
        '''.format(**self.metadata), kwargs)
    
    def unlike(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM {model}_likes
        WHERE user_id = %(user_id)s
        AND {model}_id = %({model}_id)s
        '''.format(**self.metadata), kwargs)
    
    def count_likes(self, **kwargs):
        return self._database.fetch_one('''
        SELECT count(*) AS likes_count FROM {model}_likes
        WHERE {model}_id = %({model}_id)s
        '''.format(**self.metadata), kwargs)
