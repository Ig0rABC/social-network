from json import loads
from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from flask import jsonify, request
from any_case import converts_keys
from database import Users, Replies
from settings import (
    app, DSN,
    DEFAULT_REPLY_LIMIT,
    MAX_REPLY_LIMIT
)
from .utils import (
    set_filter_params,
    check_only_required_payload_props,
    put_out_author
)

@app.route('/replies', methods=['POST'])
def create_reply():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'comment_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            author_id = record['user_id']
            cursor.execute(Replies.create(), {'author_id': author_id, **payload})
            reply = cursor.fetchone()
    put_out_author(reply)
    return jsonify(converts_keys(reply, case='camel')), 201

@app.route('/replies', methods=['GET'])
def get_replies():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_REPLY_LIMIT, MAX_REPLY_LIMIT, params)
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
            cursor.execute(Replies.filter(**params), {'user_id': user_id, **params})
            replies = cursor.fetchall()
            cursor.execute(Replies.count(**params), params)
            record = cursor.fetchone()
    for reply in replies:
        put_out_author(reply)
    return jsonify(converts_keys({
        'replies': replies,
        **record
    }, case='camel'))

@app.route('/replies/<int:reply_id>', methods=['PUT'])
def update_reply(reply_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'comment_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            user_id = cursor.fetchone()['user_id']
            cursor.execute(Replies.get_author_id(), {'id': reply_id})
            author_id = cursor.fetchone()['author_id']
    if user_id != author_id:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Replies.update(), {'id': reply_id, **payload})
            reply = cursor.fetchone()
    return jsonify(converts_keys(reply, case='camel'))

@app.route('/replies/<int:reply_id>', methods=['DELETE'])
def delete_reply(reply_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            user_id = cursor.fetchone()['user_id']
            cursor.execute(Replies.get_author_id(), {'id': reply_id})
            author_id = cursor.fetchone()['author_id']
    if user_id != author_id:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Replies.delete(), {'id': reply_id})
    return jsonify(), 205
