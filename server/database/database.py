import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.errors import ProgrammingError


class Database:

    def __init__(self, **kwargs):
        self._connection = psycopg2.connect(**kwargs)
        self._cursor = self._connection.cursor(
            cursor_factory=RealDictCursor
        )

    def rollback(self):
        self._connection.rollback()

    def execute(self, query, params={}):
        try:
            self._cursor.execute(query, params)
        except Exception as e:
            print('Database Error:', e)
            self.rollback()

    def execute_and_commit(self, query, params={}):
        self.execute(query, params)
        self._connection.commit()

    def fetch_one(self, query, params={}):
        self.execute(query, params)
        try:
            return self._cursor.fetchone()
        except ProgrammingError as e:
            print('Database Programming Error:', e)
            return {}

    def fetch_all(self, query, params={}):
        self.execute(query, params)
        try:
            return self._cursor.fetchall()
        except ProgrammingError as e:
            print('Database Programming Error:', e)
            return []

    def execute_with_returning(self, query, params={}):
        value = self.fetch_one(query, params)
        self._connection.commit()
        return value
    
    def clear(self):
        tables = [
            'tokens',
            'replies',
            'comments',
            'posts',
            'contacts',
            'profiles',
            'messages',
            'followings',
            'users_in_chats',
            'chats',
            'users',
        ]
        for table in tables:
            self.execute_and_commit(f'DELETE FROM {table}')
        sequences = [
            'replies',
            'comments',
            'posts',
            'messages',
            'chats',
            'users',
        ]
        for seq in sequences:
            self.execute_and_commit(
                f'ALTER SEQUENCE {seq}_id_seq RESTART WITH 1'
            )
