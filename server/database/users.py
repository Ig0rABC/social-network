from .tables import Table

class Users(Table):

    def register(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO users
        (login, password)
        VALUES
        (%(login)s, %(password)s)
        RETURNING ID
        ''', kwargs)
    
    def login(self, **kwargs):
        self._database.execute_and_commit('''
        INSERT INTO tokens(user_id)
        VALUES SELECT (
            SELECT user_id FROM users
            WHERE login = %(login)s
            AND password = %(password)s
        )
        ''', kwargs)
        return self._database.fetch_one('''
        SELECT token FROM tokens
        JOIN users AS u
        ON user_id = u.id
        WHERE login = %(login)s
        AND password = %(password)s
        ''', kwargs)
    
    def get_user_id(self, **kwargs):
        return self._database.fetch_one('''
        SELECT user_id FROM tokens
        WHERE token = %(token)s
        ''', kwargs)
    
    def logout(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM tokens
        WHERE token = %(token)s
        ''', kwargs)
