from json import loads
from flask import jsonify, request
from any_case import converts_keys
from settings import (
    app, database,
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
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.replies.create(**payload, author_id=author_id)
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

@app.route('/replies/<int:reply_id>', methods=['PUT'])
def update_reply(reply_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.replies.get_author_id(id=reply_id))
    if data['user_id'] != ['author_id']:
        return jsonify({'messages': 'Access error'}), 401
    data = database.replies.update(id=reply_id, **payload)
    put_out_author(data)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/replies/<int:reply_id>', methods=['DELETE'])
def delete_reply(reply_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    author_id = database.replies.get_author_id(id=reply_id)
    if user_id != author_id:
        return jsonify({'messages': 'Access error'}), 401
    database.replies.delete(id=reply_id)
    return jsonify(), 205
