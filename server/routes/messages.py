from json import loads
from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_MESSAGE_LIMIT,
    MAX_MESSAGE_LIMIT
)
from .utils import (
    set_filter_params,
    check_only_required_payload_props
)

@app.route('/messages', methods=['GET'])
def get_messages():
    params = converts_keys(request.args.to_dict(), case='snake')
    set_filter_params(DEFAULT_MESSAGE_LIMIT, MAX_MESSAGE_LIMIT, params)
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    members = database.chats.get_members(**params)
    for member in members:
        if author_id == member['user_id']:
            break
    else:
        return jsonify(), 403
    messages = database.messages.filter(**params, author_id=author_id)
    return jsonify(converts_keys({'messages': messages}, case='camel'))

@app.route('/messages', methods=['POST'])
def create_message():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'chat_id', 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    message = database.messages.create(author_id=author_id, **payload)
    return jsonify(converts_keys({'message': message}, case='camel')), 201

@app.route('/messages/<int:message_id>', methods=['PUT'])
def update_message(message_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'content')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)
    message = database.messages.get(id=message_id)
    author_id = message['author_id']
    if user_id != author_id:
        return jsonify(), 401
    message = database.messages.update(id=message_id, **payload)
    return jsonify(converts_keys({'message': message}, case='camel'))

@app.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)
    message = database.messages.get(id=message_id)
    author_id = message['author_id']
    if user_id != author_id:
        return jsonify(), 401
    database.messages.delete(id=message_id)
    return jsonify(), 205

@app.route('/last-messages', methods=['GET'])
def get_last_messages():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    messages = database.messages.get_last_messages(**data)
    return jsonify(converts_keys({'messages': messages}, case='camel'))
