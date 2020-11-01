from ..test_cases import TestCaseWithUsers
from settings import database

class ChatsDatabase(TestCaseWithUsers):
    
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

    def test_create_chat(self):
        self.register_user(self.USER_1)
        self.register_user(self.USER_2)
        self.register_user(self.USER_3)

        data = database.chats.create(**self.CHAT_1)
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['title'], self.CHAT_1['title'])
        self.assertEqual(data['owner_id'], self.CHAT_1['owner_id'])
    
    def test_add_chat_member(self):
        self.register_user(self.USER_1)
        self.register_user(self.USER_2)
        self.register_user(self.USER_3)

        database.chats.create(**self.CHAT_1)

        chats = database.chats.filter(owner_id=1)
        self.assertEqual(len(chats), 1)

        chats = database.chats.filter(owner_id=2)
        self.assertEqual(len(chats), 0)

        database.chats.add_member(chat_id=1, user_id=2)
        
        chats = database.chats.filter(user_id=1)
        self.assertEqual(len(chats), 1)

        chats = database.chats.filter(user_id=2)
        self.assertEqual(len(chats), 1)

        database.chats.add_member(chat_id=1, user_id=3)

        members = database.chats.get_members(chat_id=1)
        self.assertEqual(len(members), 3)

        database.chats.remove_member(chat_id=1, user_id=3)

        members = database.chats.get_members(chat_id=1)
        self.assertEqual(len(members), 2)
    
    def test_update_chat(self):
        self.register_user(self.USER_1)
        self.register_user(self.USER_2)

        database.chats.create(**self.CHAT_1)
        database.chats.update(id=1, **self.CHAT_2)

        chat = database.chats.filter(user_id=1)[0]
        self.assertEqual(chat['title'], self.CHAT_2['title'])
        self.assertEqual(chat['owner_id'], self.CHAT_2['owner_id'])
    
    def test_delete_chat(self):
        self.register_user(self.USER_1)

        database.chats.create(**self.CHAT_1)
        database.chats.delete(id=1)

        chats = database.chats.filter(user_id=1)
        self.assertFalse(chats)