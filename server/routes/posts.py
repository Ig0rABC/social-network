from json import loads
from flask import jsonify, request
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_POST_LIMIT,
    MAX_POST_LIMIT
)
from .utils import (
    set_filter_params,
    check_only_required_payload_props,
    put_out_author
)

@app.route('/posts', methods=['POST'])
def create_post():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'category', 'content')
    categories = [c['name'] for c in database.posts.get_categories()]
    if payload['category'] not in categories:
        return jsonify({
            'message': 'You can send only categories, which specified in this response',
            'categories': categories
        }), 400
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.posts.create(**payload, author_id=author_id)
    put_out_author(data)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/posts', methods=['GET'])
def get_posts():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_POST_LIMIT, MAX_POST_LIMIT, params)
    cookies = request.cookies
    if 'token' in cookies:
        user_id = database.users.get_user_id(**cookies)['user_id']
    else:
        user_id = 0
    posts = database.posts.filter(user_id=user_id, **params)
    for post in posts:
        put_out_author(post)
    return jsonify(converts_keys({
        'posts': posts,
        **database.posts.count(**params)
    }, case='camel'))

@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'category', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    author_id = database.posts.get_author_id(id=post_id)['author_id']
    if user_id != author_id:
        return jsonify(), 401
    data = database.posts.update(id=post_id, **payload)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.posts.get_author_id(id=post_id))
    data.update(database.users.get_user_id(**cookies))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'}), 401
    database.posts.delete(id=post_id)
    return jsonify(), 205
