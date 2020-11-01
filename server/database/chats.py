from .tables import Table


class Chats(Table):

    def create(self, **kwargs):
        data = self._database.execute_with_returning('''
        INSERT INTO chats
        (owner_id, title)
        VALUES
        (%(owner_id)s, %(title)s)
        RETURNING *
        ''', kwargs)
        kwargs.update(data)
        self._database.execute_and_commit('''
        INSERT INTO users_in_chats
        (chat_id, user_id)
        VALUES
        (%(id)s, %(owner_id)s)
        ''', kwargs)
        return data

    def delete(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM chats
        WHERE id = %(id)s
        ''', kwargs)

    def update(self, **kwargs):
        return self._database.execute_with_returning('''
        UPDATE chats
        {0}
        WHERE id = %(id)s
        RETURNING *
        '''.format(self.params_to_update(**kwargs)), kwargs)
    
    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT * FROM chats
        INNER JOIN users_in_chats
        ON chats.id = users_in_chats.chat_id
        {condition}
        '''.format(condition=self.params_to_condition(**kwargs)), kwargs)
    
    def get_members(self, **kwargs):
        return self._database.fetch_all('''
        SELECT * FROM users 
        INNER JOIN users_in_chats
        ON user_id = id
        WHERE chat_id = %(chat_id)s
        ''', kwargs)
    
    def add_member(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO users_in_chats
        (user_id, chat_id)
        VALUES
        (%(user_id)s, %(chat_id)s)
        ''' , kwargs)
    
    def remove_member(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM users_in_chats
        WHERE user_id = %(user_id)s
        AND chat_id = %(chat_id)s
        ''', kwargs)