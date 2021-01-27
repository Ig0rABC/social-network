from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, DSN,
    DEFAULT_POST_LIMIT,
    MAX_POST_LIMIT
)
from database import Users, Followings
from .utils import (
    set_filter_params,
    check_only_required_payload_props,
    check_only_required_query_params
)

@app.route('/follow/<int:user_id>', methods=['POST'])
def follow(user_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            cursor.execute(Followings.follow(), {'follower_id': record['user_id'], 'user_id': user_id})
    return jsonify(), 201

@app.route('/follow', methods=['GET'])
def get_followings():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            cursor.execute(Followings.get_followings(), {'follower_id': record['user_id']})
            followings = cursor.fetchall()
    return jsonify(converts_keys({'followings': followings}, case='camel'))

@app.route('/follow/<int:user_id>', methods=['DELETE'])
def unfollow(user_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            cursor.execute(Followings.unfollow(), {'follower_id': record['user_id'], 'user_id': user_id})
    return jsonify(), 204

@app.route('/feed', methods=['GET'])
def feed():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_POST_LIMIT, MAX_POST_LIMIT, params)
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            follower_id = cursor.fetchone()['user_id']
            cursor.execute(Followings.feed(), {'follower_id': follower_id, **params})
            posts = cursor.fetchall()
    return jsonify(converts_keys({'posts': posts}, case='camel'))
