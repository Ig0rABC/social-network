from .tables import Table


class Chats(Table):

    metadata = {
        'searchable': [
            'title'
        ]
    }

    def create():
        return '''
        INSERT INTO chats
        (owner_id, title)
        VALUES
        (%(owner_id)s, %(title)s)
        RETURNING *
        '''

    def delete():
        return '''
        DELETE FROM chats
        WHERE id = %(id)s
        '''

    def update():
        return '''
        UPDATE chats
        SET title = %(title)s
        WHERE id = %(id)s
        RETURNING *
        '''

    def get():
        return '''
        SELECT * FROM chats
        WHERE id = %(id)s
        '''

    @classmethod
    def filter(cls, **kwargs):
        return '''
        SELECT * FROM chats
        INNER JOIN chats_members
        ON chats.id = chats_members.chat_id
        {0}
        '''.format(cls.build_condition(**kwargs))

    def get_members():
        return '''
        SELECT id AS user_id, login FROM users
        INNER JOIN chats_members
        ON user_id = id
        WHERE chat_id = %(chat_id)s
        '''

    def add_member():
        return '''
        INSERT INTO chats_members
        (user_id, chat_id)
        VALUES
        (%(user_id)s, %(chat_id)s)
        '''

    def remove_member():
        return '''
        DELETE FROM chats_members
        WHERE user_id = %(user_id)s
        AND chat_id = %(chat_id)s
        '''
