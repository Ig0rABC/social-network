from json import loads
from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from flask import jsonify, request
from any_case import converts_keys
from database import Users, Posts
from settings import (
    app, DSN,
    DEFAULT_POST_LIMIT,
    MAX_POST_LIMIT
)
from .utils import (
    set_filter_params,
    check_only_required_payload_props,
    put_out_author
)
from exceptions import (
    CategoryDoesNotExist
)

@app.route('/posts', methods=['POST'])
def create_post():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'category', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            author_id = record['user_id']
            cursor.execute(Posts.create(), {'author_id': author_id, **payload})
            post = cursor.fetchone()
    put_out_author(post)
    return jsonify(converts_keys(post, case='camel')), 201

@app.route('/posts', methods=['GET'])
def get_posts():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_POST_LIMIT, MAX_POST_LIMIT, params)
    cookies = request.cookies
    if 'token' in cookies:
        with connect(DSN) as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(Users.get_user_id(), cookies)
                record = cursor.fetchone()
                user_id = record['user_id']
    else:
        user_id = 0
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Posts.filter(**params), {'user_id': user_id, **params})
            posts = cursor.fetchall()
            cursor.execute(Posts.count(**params), params)
            record = cursor.fetchone()
    for post in posts:
        put_out_author(post)
    return jsonify(converts_keys({
        'posts': posts,
        **record
    }, case='camel'))

@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'category', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            user_id = cursor.fetchone()['user_id']
            cursor.execute(Posts.get_author_id(), {'id': post_id})
            author_id = cursor.fetchone()['author_id']
    if user_id != author_id:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Posts.update(), {'id': post_id, **payload})
            post = cursor.fetchone()
    return jsonify(converts_keys(post, case='camel'))

@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            user_id = cursor.fetchone()['user_id']
            cursor.execute(Posts.get_author_id(), {'id': post_id})
            author_id = cursor.fetchone()['author_id']
    if user_id != author_id:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Posts.delete(), {'id': post_id})
    return jsonify(), 205
