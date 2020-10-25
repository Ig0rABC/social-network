from .tables import Table

class Messages(Table):
    
    def create_message(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO messages
        (sender_id, recipient_id, content)
        VALUES
        (%(sender_id)s, %(recipient_id)s, %(content)s)
        RETURNING id
        ''', kwargs)
    
    def get_last_messages(self, **kwargs):
        return self._database.fetch_one('''
        SELECT * FROM messages
        WHERE sender_id = %(user_id)s
        OR recipient_id = %(user_id)s
        ORDER BY created DESC
        LIMIT 1
        ''', kwargs)

    def get_correspondence(self, **kwargs):
        return self._database.fetch_all('''
        
        ''', kwargs)
