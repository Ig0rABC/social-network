from ..test_cases import TestCaseWithUsers
from settings import database

class MessagesDatabase(TestCaseWithUsers):
    
    USER_1 = {
        'login': 'testUser1',
        'password': 'testPassword1'
    }
    USER_2 = {
        'login': 'testUser2',
        'password': 'testPassword2'
    }
    USER_3 = {
        'login': 'testUser3',
        'password': 'testPassword3'
    }
    CHAT_1 = {
        'owner_id': 1,
        'title': 'programming'
    }
    CHAT_2 = {
        'owner_id': 2,
        'title': 'programming'
    }
    MESSAGE_1 = {
        'chat_id': 1,
        'content': 'jfsjpsjgjpgj'
    }
    MESSAGE_2 = {
        'chat_id': 2,
        'content': 'c;mkmfok'
    }
    
    def test_create_message(self):
        self.register_user(self.USER_1)
        self.register_user(self.USER_2)

        database.chats.create(**self.CHAT_1)
        message = database.messages.create(author_id=1, **self.MESSAGE_1)
        
        self.assertEqual(message['id'], 1)
        self.assertEqual(message['author_id'], 1)
        self.assertEqual(message['content'], self.MESSAGE_1['content'])
    
    def test_update_message(self):
        self.register_user(self.USER_1)
        database.chats.create(**self.CHAT_1)
        message = database.messages.create(author_id=1, **self.MESSAGE_1)
        updated_message = self.MESSAGE_1.copy()
        updated_message['content'] = '3463480690'
        message = database.messages.update(id=1, **updated_message)
        self.assertEqual(message['author_id'], 1)
        self.assertEqual(message['chat_id'], updated_message['chat_id'])
        self.assertEqual(message['content'], updated_message['content'])
    
    def test_delete_message(self):
        self.register_user(self.USER_1)
        database.chats.create(**self.CHAT_1)
        message = database.messages.create(author_id=1, **self.MESSAGE_1)
        database.messages.delete(**message)

