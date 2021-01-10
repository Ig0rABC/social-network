from json import loads
from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from flask import jsonify, request
from any_case import converts_keys
from database import Users, Comments
from settings import (
    app, DSN,
    DEFAULT_COMMENT_LIMIT,
    MAX_COMMENT_LIMIT
)
from .utils import (
    set_filter_params,
    check_only_required_payload_props,
    put_out_author
)

@app.route('/comments', methods=['POST'])
def create_comment():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'post_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            author_id = record['user_id']
            cursor.execute(Comments.create(), {'author_id': author_id, **payload})
            comment = cursor.fetchone()
    put_out_author(comment)
    return jsonify(converts_keys(comment, case='camel')), 201

@app.route('/comments', methods=['GET'])
def get_comments():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_COMMENT_LIMIT, MAX_COMMENT_LIMIT, params)
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
            cursor.execute(Comments.filter(**params), {'user_id': user_id, **params})
            comments = cursor.fetchall()
            cursor.execute(Comments.count(**params), params)
            record = cursor.fetchone()
    for comment in comments:
        put_out_author(comment)
    return jsonify(converts_keys({
        'comments': comments,
        **record
    }, case='camel'))

@app.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'post_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            user_id = cursor.fetchone()['user_id']
            cursor.execute(Comments.get_author_id(), {'id': comment_id})
            author_id = cursor.fetchone()['author_id']
    if user_id != author_id:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Comments.update(), {'id': comment_id, **payload})
            comment = cursor.fetchone()
    return jsonify(converts_keys(comment, case='camel'))

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            user_id = cursor.fetchone()['user_id']
            cursor.execute(Comments.get_author_id(), {'id': comment_id})
            author_id = cursor.fetchone()['author_id']
    if user_id != author_id:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Comments.delete(), {'id': comment_id})
    return jsonify(), 205
