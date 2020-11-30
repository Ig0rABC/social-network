from .tables import Table


class Chats(Table):

    metadata = {
        'searchable': [
            'title'
        ]
    }

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
        INSERT INTO chats_members
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
    
    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT * FROM chats
        WHERE id = %(id)s
        ''', kwargs)
    
    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT * FROM chats
        INNER JOIN chats_members
        ON chats.id = chats_members.chat_id
        {condition}
        '''.format(condition=self.build_condition(**kwargs)), kwargs)
    
    def get_members(self, **kwargs):
        return self._database.fetch_all('''
        SELECT id AS user_id, login FROM users
        INNER JOIN chats_members
        ON user_id = id
        WHERE chat_id = %(chat_id)s
        ''', kwargs)
    
    def add_member(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO chats_members
        (user_id, chat_id)
        VALUES
        (%(user_id)s, %(chat_id)s)
        ''' , kwargs)
    
    def remove_member(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM chats_members
        WHERE user_id = %(user_id)s
        AND chat_id = %(chat_id)s
        ''', kwargs)