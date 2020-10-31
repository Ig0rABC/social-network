from .tables import AuthorContentTable

class Comments(AuthorContentTable):

    metadata = {
        'table': 'comments',
        'model': 'comment',
        'foreign_key': 'post_id',
        'dependent_table': 'answers'
    }
