from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_COMMENT_LIMIT,
    MAX_COMMENT_LIMIT
)
from .utils import (
    set_filter_params,
    are_only_required_params,
    only_required_params_error
)

@app.route('/comments', methods=['POST'])
def create_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'post_id', 'content'):
        return only_required_params_error('post_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.comments.create(**params, author_id=author_id)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/comments', methods=['GET'])
def get_comments():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_COMMENT_LIMIT, MAX_COMMENT_LIMIT, params)
    return jsonify(converts_keys({
        'comments': database.comments.filter(**params),
        **database.comments.count(**params)
    }, case='camel'))

@app.route('/comments', methods=['PUT'])
def update_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'id', 'content'):
        return only_required_params_error('id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.comments.get_author_id(**params))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    data = database.comments.update(**params)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/comments', methods=['DELETE'])
def delete_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'id'):
        return only_required_params_error('id')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.comments.get_author_id(**params))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    database.comments.delete(**params)
    return jsonify({'message': 'Comment has been deleted'})
