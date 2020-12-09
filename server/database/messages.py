from .tables import Table


class Messages(Table):

    metadata = {
        'searchable': [
            'content'
        ]
    }

    def create():
        return '''
        INSERT INTO messages
        (author_id, chat_id, content)
        VALUES
        (%(author_id)s, %(chat_id)s, %(content)s)
        RETURNING *
        '''

    def update():
        return '''
        UPDATE messages
        SET content = %(content)s
        WHERE id = %(id)s
        RETURNING *
        '''

    def delete():
        return '''
        DELETE FROM messages
        WHERE id = %(id)s
        '''
    
    def get():
        return '''
        SELECT * FROM messages
        WHERE id = %(id)s
        '''
    
    @classmethod
    def filter(cls, **kwargs):
        return '''
        SELECT * FROM messages
        INNER JOIN users
        ON author_id = users.id
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=cls.params_to_update(**kwargs))

    def get_last_messages():
        return '''
        SELECT * FROM messages AS m 
        INNER JOIN users_in_chats AS u 
        ON m.chat_id = u.chat_id 
        WHERE (
            m.chat_id, created) IN (
            SELECT m.chat_id, max(created) 
            FROM messages
            GROUP BY id
        ) AND user_id = %(user_id)s
        '''
