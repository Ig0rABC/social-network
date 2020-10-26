from .tables import Table


class Users(Table):

    def register(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO users
        (login, password)
        VALUES
        (%(login)s, %(password)s)
        RETURNING id
        ''', kwargs).get('id')

    def login(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO tokens(user_id)
        SELECT id FROM users
        WHERE login = %(login)s
        AND password = %(password)s
        RETURNING token
        ''', kwargs).get('token')

    def get_user_id(self, **kwargs):
        return self._database.fetch_one('''
        SELECT user_id FROM tokens
        WHERE token = %(token)s
        ''', kwargs).get('user_id')

    def logout(self, **kwargs):
        self._database.execute_and_commit('''
        DELETE FROM tokens
        WHERE token = %(token)s
        ''', kwargs)
