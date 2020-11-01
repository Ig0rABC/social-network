from .tables import Table


class Messages(Table):

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

    def get_last_messages(self, **kwargs):
        return self._database.fetch_all('''
        SELECT * FROM messages AS m
        INNER JOIN users_in_chats AS um
        ON um.chat_id = m.chat_id
        WHERE um.user_id = %(user_id)s
        ''', kwargs)
