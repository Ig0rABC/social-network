import psycopg2
from psycopg2.extras import RealDictCursor

class Database:
    
    def __init__(self, **kwargs):
        self._connection = psycopg2.connect(**kwargs)
        self._cursor = self._connection.cursor(
            cursor_factory=RealDictCursor
        )
    
    def execute(self, query, params={}):
        self._cursor.execute(query, params)

    def execute_and_commit(self, query, params={}):
        self.execute(query, params)
        self._connection.commit()
    
    def execute_with_returning(self, query, params={}):
        value = self.fetch_one(query, params)
        self._connection.commit()
        return value
    
    def fetch_one(self, query, params={}):
        self.execute(query, params)
        return self._cursor.fetchone()
    
    def fetch_all(self, query, params={}):
        self.execute(query, params)
        return self._cursor.fetchall()

    def rollback(self):
        self._connection.rollback()
