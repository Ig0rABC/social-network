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

@app.route('/categories', methods=['GET'])
def get_categories():
    categories = database.posts.get_categories()
    return jsonify({'categories': categories})

@app.route('/posts', methods=['POST'])
def create_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'category', 'content'):
        return jsonify(), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.posts.create(**params, author_id=author_id)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/posts', methods=['GET'])
def get_posts():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_POST_LIMIT, MAX_POST_LIMIT, params)
    return jsonify(converts_keys({
        'posts': database.posts.filter(**params),
        **database.posts.count(**params)
    }, case='camel'))

@app.route('/posts', methods=['PUT'])
def update_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'id', 'content'):
        return jsonify(), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.posts.get_author_id(**params))
    data.update(database.users.get_user_id(**cookies))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'}), 401
    data = database.posts.update(**params)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/posts', methods=['DELETE'])
def delete_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if not are_only_required_params(params, 'id'):
        return jsonify(), 400
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.posts.get_author_id(**params))
    data.update(database.users.get_user_id(**cookies))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'}), 401
    database.posts.delete(**params)
    return jsonify({'message': 'Post has been deleted'}), 205

@app.route('/post-likes', methods=['POST'])
def like_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'post_id'):
        return jsonify(), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    database.posts.like(**params, **data)
    return jsonify({'message': 'Post has been tagged "I like"'})

@app.route('/post-likes', methods=['DELETE'])
def unlike_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not are_only_required_params(params, 'post_id'):
        return jsonify(), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    database.posts.unlike(**params, **data)
    return jsonify({'message': 'Mark "I like" has been deleted from the post'})
