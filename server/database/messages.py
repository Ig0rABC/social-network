from .tables import Table


class Messages(Table):

    metadata = {
        'searchable': [
            'content'
        ]
    }

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO messages
        (author_id, chat_id, content)
        VALUES
        (%(author_id)s, %(chat_id)s, %(content)s)
        RETURNING *
        ''', kwargs)

    def update(self, **kwargs):
        return self._database.execute_with_returning('''
        UPDATE messages
        {0}
        WHERE id = %(id)s
        RETURNING *
        '''.format(self.params_to_update(**kwargs)), kwargs)

    def delete(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM messages
        WHERE id = %(id)s
        ''', kwargs)
    
    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT * FROM messages
        WHERE id = %(id)s
        ''', kwargs)
    
    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT * FROM messages
        INNER JOIN users
        ON author_id = users.id
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=self.params_to_update(**kwargs)), kwargs)

    def get_last_messages(self, **kwargs):
        return self._database.fetch_all('''
        SELECT * FROM messages AS m 
        INNER JOIN users_in_chats AS u 
        ON m.chat_id = u.chat_id 
        WHERE (
            m.chat_id, created) IN (
            SELECT m.chat_id, max(created) 
            FROM messages
            GROUP BY id
        ) AND user_id = %(user_id)s
        ''', kwargs)
