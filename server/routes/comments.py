from json import loads
from flask import jsonify, request
from any_case import converts_keys
from settings import (
    app, database,
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
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.comments.create(**payload, author_id=author_id)
    put_out_author(data)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/comments', methods=['GET'])
def get_comments():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_COMMENT_LIMIT, MAX_COMMENT_LIMIT, params)
    comments = database.comments.filter(**params)
    for comment in comments:
        put_out_author(comment)
    return jsonify(converts_keys({
        'comments': comments,
        **database.comments.count(**params)
    }, case='camel'))

@app.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.comments.get_author_id(id=comment_id))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    data = database.comments.update(id=comment_id, **payload)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.comments.get_author_id(id=comment_id))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    database.comments.delete(id=comment_id)
    return jsonify({'message': 'Comment has been deleted'})
