from collections import namedtuple
from flask import Flask
from database import *

database = Database(dbname='socialnetwork')
database_tables = {
    'users': Users(database),
    'contacts': Contacts(database),
    'profiles': Profiles(database),
    'messages': Messages(database),
    'posts': Posts(database),
    'comments': Comments(database),
    'answers': Answers(database)
}
DatabaseTables = namedtuple('Database', database_tables.keys())
database = DatabaseTables(**database_tables)

app = Flask(__name__)
