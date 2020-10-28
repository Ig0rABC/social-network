from .tables import AuthorContentTable

class Answers(AuthorContentTable):

    metadata = {
        'table': 'answers',
        'model': 'answer',
        'foreign_key': 'comment_id'
    }
