class Table:

    metadata = {
        'searchable': []
    }

    def build_equal_condition(**kwargs):
        if not kwargs:
            return ''
        return 'WHERE ' + ' AND '.join(
            f'{k} = %({k})s'
            for k in kwargs.keys()
        )

    @classmethod
    def build_condition(cls, **kwargs):
        kwargs.pop('limit', None)
        kwargs.pop('offset', None)
        condition = cls.build_equal_condition(**{
            k: v
            for k, v in kwargs.items()
            if k != 'search'
        })
        if 'search' in kwargs.keys():
            search = 'WHERE LOWER(content) LIKE LOWER(%(search)s)'
        else:
            search = ''
        if not condition:
            if not search:
                return ''
            return search
        return condition + ' ' + search.replace('WHERE', 'AND')

    def params_to_update(**kwargs):
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

    @classmethod
    def create(cls):
        return '''
        INSERT INTO {0} (user_id)
        VALUES (%(user_id)s)
        '''.format(cls.metadata['table'])

    @classmethod
    def get(cls):
        return '''
        SELECT * FROM {0}
        WHERE user_id = %(user_id)s
        '''.format(cls.metadata['table'])

    @classmethod
    def update(cls, user_info):
        return '''
        UPDATE {0}
        {1}
        WHERE user_id = %(user_id)s
        '''.format(cls.metadata['table'], cls.params_to_update(**user_info))


class AuthorContentTable(Table):

    metadata = {
        'table': None,
        'model': None,
        'foreign_key': None,
        'dependent_table': None,
        'searchable': None
    }

    @classmethod
    def count(cls, **kwargs):
        return '''
        SELECT count(*) AS total_count
        FROM {0}
        {1}
        '''.format(cls.metadata['table'], cls.build_condition(**kwargs))

    @classmethod
    def get_author_id(cls):
        return '''
        SELECT author_id FROM {0}
        WHERE id = %(id)s
        '''.format(cls.metadata['table'])

    @classmethod
    def delete(cls):
        return '''
        DELETE FROM {0}
        WHERE id = %(id)s
        '''.format(cls.metadata['table'])

    @classmethod
    def like(cls):
        return '''
        INSERT INTO {0}_likes
        (user_id, {0}_id)
        VALUES
        (%(user_id)s, %({0}_id)s)
        '''.format(cls.metadata['model'])

    @classmethod
    def unlike(cls):
        return '''
        DELETE FROM {0}_likes
        WHERE user_id = %(user_id)s
        AND {0}_id = %({0}_id)s
        '''.format(cls.metadata['model'])
