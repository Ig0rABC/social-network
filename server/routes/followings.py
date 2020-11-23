from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_POST_LIMIT,
    MAX_POST_LIMIT
)
from .utils import (
    set_filter_params,
    check_only_required_payload_props,
    check_only_required_query_params
)

@app.route('/followings/<int:user_id>', methods=['POST'])
def follow(user_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    follower_id = database.users.get_user_id(**cookies)['user_id']
    database.followings.follow(follower_id=follower_id, followed_id=user_id)
    return jsonify(), 201

@app.route('/followings', methods=['GET'])
def get_followings():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    followings = database.followings.get_followings(**data)
    return jsonify(converts_keys({'folllowings': followings}, case='camel'))

@app.route('/followings/<int:user_id>', methods=['DELETE'])
def unfollow(user_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    follower_id = database.users.get_user_id(**cookies)['user_id']
    database.followings.unfollow(follower_id=follower_id, followed_id=user_id)
    return jsonify(), 204

@app.route('/followings/feed', methods=['GET'])
def get_feed():
    cookies = request.cookies()
    if 'token' not in cookies:
        return jsonify(), 401
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_POST_LIMIT, MAX_POST_LIMIT, params)
    follower_id = database.users.get_user_id(**cookies)['user_id']
    posts = database.followings.get_feed(follower_id=follower_id, **params)
    return jsonify(converts_keys({'posts': posts}, case='camel'))
