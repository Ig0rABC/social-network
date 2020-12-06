from .tables import Table


class Users(Table):

    def register(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO users
        (login, password)
        VALUES
        (%(login)s, crypt(%(password)s, gen_salt('bf', 4)))
        RETURNING id AS user_id
        ''', kwargs)

    def login(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO tokens(user_id)
        SELECT id FROM users
        WHERE login = %(login)s
        AND password = crypt(%(password)s, password)
        RETURNING token
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

    def me(self, **kwargs):
        return self._database.fetch_one('''
        SELECT users.id, login, photo_url FROM users
        INNER JOIN profiles
        ON profiles.user_id = users.id
        WHERE users.id = %(user_id)s
        ''', kwargs)
    
    def get_user_data(self, **kwargs):
        return self._database.fetch_one('''
        SELECT login, profiles.*, contacts.*, (
            SELECT exists(
                SELECT true FROM followings
                WHERE follower_id = %(follower_id)s
                AND followings.user_id = %(id)s
            ) AS is_followed
        )
        FROM users
        INNER JOIN profiles
        ON profiles.user_id = id
        INNER JOIN contacts
        ON contacts.user_id = id
        WHERE id = %(id)s
        ''', kwargs)
