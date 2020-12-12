from .tables import Table


class Users(Table):

    def register():
        return '''
        INSERT INTO users
        (login, password)
        VALUES
        (%(login)s, crypt(%(password)s, gen_salt('bf', 4)))
        RETURNING id AS user_id
        '''

    def login():
        return '''
        INSERT INTO tokens(user_id)
        SELECT id FROM users
        WHERE login = %(login)s
        AND password = crypt(%(password)s, password)
        RETURNING token
        '''

    def get_user_id():
        return '''
        SELECT user_id FROM tokens
        WHERE token = %(token)s
        '''

    def logout():
        return '''
        DELETE FROM tokens
        WHERE token = %(token)s
        '''

    def me():
        return '''
        SELECT users.id, login, photo_url FROM users
        INNER JOIN profiles
        ON profiles.user_id = users.id
        WHERE users.id = %(user_id)s
        '''

    def get_user_data():
        return '''
        SELECT login, profiles.*, contacts.*, (
            SELECT exists(
                SELECT true FROM followings
                WHERE follower_id = %(follower_id)s
                AND followings.user_id = %(id)s
            ) AS is_followed
        ), (
            SELECT count(*) AS followers_count
            FROM followings
            WHERE followings.user_id = %(id)s
        )
        FROM users
        INNER JOIN profiles
        ON profiles.user_id = id
        INNER JOIN contacts
        ON contacts.user_id = id
        WHERE id = %(id)s
        '''
