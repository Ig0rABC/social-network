class Table:

    def __init__(self, database):
        self._database = database

    def params_to_condition(self, **kwargs):
        kwargs.pop('limit', None)
        kwargs.pop('offset', None)
        if not kwargs:
            return ''
        return 'WHERE ' + ' AND '.join(
            f'{key} = %({key})s'
            for key in kwargs.keys()
        )

    def params_to_update(self, **kwargs):
        if not kwargs:
            return ''
        return 'SET ' + ', '.join(
            f'{key} = %({key})s'
            for key in kwargs.keys()
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
        '''.format(self.table, self.params_to_update(**kwargs)), kwargs)


class AuthorContentTable(Table):

    metadata = {
        'table': None,
        'model': None,
        'foreign_key': None,
        'dependent_table': None
    }

    def count(self, **kwargs):
        return self._database.fetch_one('''
        SELECT count(*) AS total_count FROM {table}
        {condition}
        '''.format(**self.metadata, condition=self.params_to_condition(**kwargs)), kwargs)

    def get_author_id(self, **kwargs):
        return self._database.fetch_one('''
        SELECT author_id FROM {table}
        WHERE id = %(id)s
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
