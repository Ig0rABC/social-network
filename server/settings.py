import re
from flask import Flask


DEBUG = False
app = Flask(__name__)

DEFAULT_POST_LIMIT = 4
MAX_POST_LIMIT = 12

DEFAULT_COMMENT_LIMIT = 8
MAX_COMMENT_LIMIT = 20

DEFAULT_REPLY_LIMIT = 8
MAX_REPLY_LIMIT = 20

DEFAULT_MESSAGE_LIMIT = 16
MAX_MESSAGE_LIMIT = 32

REMEMBER_ME_MAX_AGE = 60*60*24*7

LOGIN_PATTERN = re.compile(r'\w{6,}')
PASSWORD_PATTERN = re.compile(r'\w{4,}')

CONTACTS_PATTERNS = {
    'github': re.compile(r'https://github.com/[\w\d]+'),
    'telegram': re.compile(r'@[\w\d]{5,}'),
    'email': re.compile(r'\w+@\w+\.\w{2,3}'),
    'vk': re.compile(r'https://vk.com/(id\d+|[\w\d]{5,32})'),
    'facebook': re.compile(r'https://facebook.com/[\w\d]+'),
    'twitter': re.compile(r'https://twitter.com/[\w\d]+'),
    'instagram': re.compile(r'@[\w\d]{3,}'),
    'phone_number': re.compile(r'((\+\d|\d) \d{3} \d{3}-\d{2}-\d{2})|((\+\d|\d) \d{3} \d{3} \d{2} \d{2})|(\+?\d{11})')
}

LOGGING_CONFIG = {
    'version': 1,
    'formatters': {
        'default': {
            'format': '%(levelname)s: %(message)s',
        }
    },
    'handlers': {
        'wsgi': {
            'class': 'logging.FileHandler',
            'formatter': 'default',
            'filename': 'server.log'
        }
    },
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
}

DSN = 'dbname=socialnetwork'
