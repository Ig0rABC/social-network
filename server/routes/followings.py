from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_POST_LIMIT,
    MAX_POST_LIMIT
)
from .utils import (
    set_filter_params,
    are_only_required_params
)

@app.route('/followings', methods=['POST'])
def follow():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'user_id'):
        return jsonify(), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    try:
        params['followed_id'] = params.pop('user_id')
    except:
        return jsonify({'message': 'userId parameter is not specifed'}), 400
    set_filter_params(DEFAULT_POST_LIMIT, MAX_POST_LIMIT, params)
    follower_id = database.users.get_user_id(**cookies)['user_id']
    database.followings.follow(follower_id=follower_id, **cookies)
    return jsonify(), 201

@app.route('/followings', methods=['GET'])
def get_followings():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    followings = database.followings.get_followings(**data)
    return jsonify(converts_keys({'folllowings': followings}, case='camel'))

@app.route('/followings', methods=['DELETE'])
def unfollow():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'user_id'):
        return jsonify(), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    try:
        params['followed_id'] = params.pop('user_id')
    except:
        return jsonify({'message': 'userId parameter is not specifed'}), 400
    follower_id = database.users.get_user_id(**cookies)['user_id']
    database.followings.unfollow(follower_id=follower_id, **params)
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
