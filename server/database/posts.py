from .tables import AuthorContentTable

class Posts(AuthorContentTable):

    table = 'posts'
    model = 'post'
    foreign_key = 'category'
    
    def get_categories(self):
        return self._database.fetch_all('SELECT * FROM categories')
