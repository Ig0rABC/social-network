from .tables import AuthorContentTable

class Answers(AuthorContentTable):

    table = 'answers'
    model = 'answer'
    foreign_key = 'comment_id'
