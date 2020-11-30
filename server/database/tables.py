class Table:

    metadata = {
        'searchable': []
    }

    def __init__(self, database):
        self._database = database

    def build_equal_condition(self, **kwargs):
        if not kwargs:
            return ''
        return 'WHERE ' + ' AND '.join(
            f'{k} = %({k})s'
            for k in kwargs.keys()
        )

    def build_like_condition(self, **kwargs):
        if not kwargs:
            return ''
        return 'WHERE ' + ' AND '.join(
            f'LOWER({k}) LIKE LOWER(%({k})s)'
            for k in kwargs.keys()
        )

    def build_condition(self, **kwargs):
        kwargs.pop('limit', None)
        kwargs.pop('offset', None)
        condition = self.build_equal_condition(**{
            k: v
            for k, v in kwargs.items()
            if k not in self.metadata['searchable']
        })
        search = self.build_like_condition(**{
            k: v
            for k, v in kwargs.items()
            if k in self.metadata['searchable']
        })
        if not condition:
            if not search:
                return ''
            return search
        return condition + ' ' + search.replace('WHERE', 'AND')

    def params_to_update(self, **kwargs):
        if not kwargs:
            return ''
        return 'SET ' + ', '.join(
            f'{key} = %({key})s'
            for key in kwargs.keys()
        )


class UserInfoTable(Table):

    metadata = {
        'table': None
    }

    def create(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO {0} (user_id)
        VALUES (%(user_id)s)
        '''.format(self.metadata['table']), kwargs)

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT * FROM {0}
        WHERE user_id = %(user_id)s
        '''.format(self.metadata['table']), kwargs)

    def update(self, **kwargs):
        self._database.execute_and_commit('''
        UPDATE {0}
        {1}
        WHERE user_id = %(user_id)s
        '''.format(self.metadata['table'], self.params_to_update(**kwargs)), kwargs)


class AuthorContentTable(Table):

    metadata = {
        'table': None,
        'model': None,
        'foreign_key': None,
        'dependent_table': None,
        'searchable': None
    }

    def count(self, **kwargs):
        condition = kwargs.copy()
        condition.pop('user_id', None)
        if kwargs.get('content', None):
            kwargs['content'] = '%' + kwargs['content'] + '%'
        return self._database.fetch_one('''
        SELECT count(*) AS total_count FROM {table}
        {condition}
        '''.format(**self.metadata, condition=self.build_condition(**condition)), kwargs)

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
