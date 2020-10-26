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

    table = None
    model = None
    foreign_key = None

    def filter(self, **kwargs):
        params = kwargs.copy()
        params.pop('limit')
        params.pop('offset')
        return self._database.fetch_all('''
        SELECT * FROM {0}
        {1}
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(self.table, self.params_to_condition(params)), kwargs)
    
    def count(self, **kwargs):
        return self._database.fetch_one('''
        SELECT count(*) AS total_count FROM {0}
        {1}
        '''.format(self.table, self.params_to_condition(kwargs)), kwargs)

    def get_author_id(self, **kwargs):
        return self._database.fetch_one('''
        SELECT author_id FROM {0}
        WHERE id = %(id)s
        '''.format(self.table), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO {0}
        (author_id, {1}, content)
        VALUES
        (%(author_id)s, %({1})s, %(content)s)
        RETURNING *
        '''.format(self.table, self.foreign_key), kwargs)
    
    def update(self, **kwargs):
        return self._database.execute_with_returning('''
        UPDATE {0}
        SET content = %(content)s
        WHERE id = %(id)s
        RETURNING *
        '''.format(self.table), kwargs)

    def delete(self, **kwargs):
        return self._database.execute_and_commit('''
        DELETE FROM {0}
        WHERE id = %(id)s
        '''.format(self.table), kwargs)

    def like(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO {0}_likes
        (user_id, {0}_id)
        VALUES
        (%(user_id)s, %({0}_id)s)
        '''.format(self.model), kwargs)
    
    def unlike(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM {0}_likes
        WHERE user_id = %(user_id)s
        AND {0}_id = %({0}_id)s
        '''.format(self.model), kwargs)
    
    def count_likes(self, **kwargs):
        return self._database.fetch_one('''
        SELECT count(*) AS likes_count FROM {0}_likes
        WHERE {0}_id = %({0}_id)s
        '''.format(self.model), kwargs)
