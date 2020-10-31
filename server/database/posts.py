from .tables import AuthorContentTable

class Posts(AuthorContentTable):

    metadata = {
        'table': 'posts',
        'model': 'post',
        'foreign_key': 'category',
    }
    
    def get_categories(self):
        return self._database.fetch_all('SELECT * FROM categories')

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM post_likes
            WHERE post_id = posts.id
        ), (
            SELECT count(*) AS comments_count
            FROM comments
            WHERE post_id = posts.id
        ), login, first_name, last_name, photo_url
        FROM posts
        INNER JOIN users
        ON author_id = users.id
        INNER JOIN profiles
        ON author_id = profiles.user_id
        WHERE posts.id = %(id)s
        '''.format(**self.metadata), kwargs)

    def filter(self, **kwargs):
        return self._database.fetch_all('''
        SELECT *, (
            SELECT count(*) AS likes_count
            FROM {model}_likes
            WHERE id = {model}_id
        ), (
            SELECT count(*) AS comments_count
            FROM comments
            WHERE {model}_id = id
        ) FROM {table}
        {condition}
        ORDER BY created DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(**self.metadata, condition=self.params_to_condition(**kwargs)), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO {table}
        (author_id, {foreign_key}, content)
        VALUES
        (%(author_id)s, %({foreign_key})s, %(content)s)
        RETURNING *,
        (SELECT 0 AS likes_count),
        (SELECT 0 AS comments_count)
        '''.format(**self.metadata), kwargs)
