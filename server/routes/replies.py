from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_REPLY_LIMIT,
    MAX_REPLY_LIMIT
)
from .utils import (
    set_filter_params,
    are_only_required_params,
    only_required_params_error,
    put_out_author
)

@app.route('/replies', methods=['POST'])
def create_reply():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'comment_id', 'content'):
        return only_required_params_error('comment_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.replies.create(**params, author_id=author_id)
    put_out_author(data)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/replies', methods=['GET'])
def get_replies():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_REPLY_LIMIT, MAX_REPLY_LIMIT, params)
    replies = database.posts.filter(**params)
    for reply in replies:
        put_out_author(reply)
    return jsonify(converts_keys({
        'replies': replies,
        **database.replies.count(**params)
    }, case='camel'))

@app.route('/replies', methods=['PUT'])
def update_reply():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'id', 'content'):
        return only_required_params_error('id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.replies.get_author_id(**params))
    if data['user_id'] != ['author_id']:
        return jsonify({'messages': 'Access error'}), 401
    data = database.replies.update(**params, **data)
    put_out_author(data)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/replies', methods=['DELETE'])
def delete_reply():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'id'):
        return only_required_params_error('id')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    author_id = database.replies.get_author_id(**params)
    if user_id != author_id:
        return jsonify({'messages': 'Access error'}), 401
    database.replies.delete(**params)
    return jsonify(), 205
