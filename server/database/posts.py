from .tables import AuthorContentTable

class Posts(AuthorContentTable):

    metadata = {
        'table': 'posts',
        'model': 'post',
        'foreign_key': 'category',
        'searchable': [
            'content'
        ]
    }
    
    def get_categories(self):
        return self._database.fetch_all('SELECT * FROM categories')

    def get(self, **kwargs):
        return self._database.fetch_one('''
        SELECT posts.*, (
            SELECT count(*) AS likes_count
            FROM post_likes
            WHERE post_id = posts.id
        ), (
            SELECT count(*) AS comments_count
            FROM comments
            WHERE post_id = posts.id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ) FROM posts
        WHERE posts.id = %(id)s
        ''', kwargs)

    def filter(self, **kwargs):
        condition = kwargs.copy()
        condition.pop('user_id', None)
        if kwargs.get('content', None):
            kwargs['content'] = '%' + kwargs['content'] + '%'
        return self._database.fetch_all('''
        SELECT posts.*, (
            SELECT count(*) AS likes_count
            FROM post_likes
            WHERE id = post_id
        ), (
            SELECT count(*) AS comments_count
            FROM comments
            WHERE post_id = posts.id
        ), (
            SELECT login FROM users
            WHERE author_id = users.id
        ), (
            SELECT photo_url FROM profiles
            WHERE author_id = profiles.user_id
        ), (
            SELECT exists(
                SELECT true FROM post_likes
                WHERE post_likes.user_id = %(user_id)s
                AND post_likes.post_id = posts.id
            ) AS is_liked
        ) FROM posts
        {condition}
        ORDER BY id DESC
        LIMIT %(limit)s
        OFFSET %(offset)s
        '''.format(condition=self.build_condition(**condition)), kwargs)

    def create(self, **kwargs):
        return self._database.execute_with_returning('''
        INSERT INTO posts
        (author_id, category, content)
        VALUES
        (%(author_id)s, %(category)s, %(content)s)
        RETURNING posts.*,
        (SELECT %(author_id)s AS author_id),
        (SELECT login FROM users WHERE users.id = %(author_id)s),
        (SELECT photo_url FROM profiles WHERE user_id = %(author_id)s),
        (SELECT 0 AS likes_count),
        (SELECT 0 AS comments_count)
        ''', kwargs)

    def update(self, **kwargs):
        return self._database.execute_with_returning('''
        UPDATE {table}
        SET content = %(content)s,
        category = %(category)s
        WHERE id = %(id)s
        RETURNING posts.*, (
            SELECT login FROM users
            INNER JOIN comments
            ON users.id = comments.author_id
            WHERE comments.id = %(id)s
        ), (
            SELECT photo_url FROM profiles
            INNER JOIN comments
            ON profiles.user_id = comments.author_id
            WHERE comments.id = %(id)s
        ),
        (SELECT 0 AS likes_count),
        (SELECT 0 AS comments_count)
        '''.format(**self.metadata), kwargs)
