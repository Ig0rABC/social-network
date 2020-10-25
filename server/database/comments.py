from .tables import AuthorContentTable

class Comments(AuthorContentTable):

    table = 'comments'
    model = 'comment'
    foreign_key = 'post_id'
