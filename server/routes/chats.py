from json import loads
from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database
from .utils import (
    check_only_required_payload_props,
    check_only_required_query_params
)

@app.route('/chats', methods=['GET'])
def get_chats():
    cookies = request.cookies
    data = database.users.get_user_id(**cookies)
    chats = database.chats.filter(**data)
    return jsonify(converts_keys(chats, case='camel'))

@app.route('/own-chats', methods=['GET'])
def get_own_chats():
    cookies = request.cookies
    owner_id = database.users.get_user_id(**cookies)['user_id']
    chats = database.chats.filter(owner_id=owner_id, user_id=owner_id)
    return jsonify(converts_keys(chats, case='camel'))

@app.route('/chats', methods=['POST'])
def create_chat():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'title')
    cookies = request.cookies
    owner_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.create(**payload, owner_id=owner_id)
    return jsonify(converts_keys(chat, case='camel')), 201

@app.route('/chats/<int:chat_id>', methods=['PUT'])
def update_chat(chat_id):
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'title')
    cookies = request.cookies
    user_id = database.users.get_user_id(**cookies)['user_id']
    owner_id = database.chats.get(id=chat_id)['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    chat = database.chats.update(id=chat_id, **payload)
    return jsonify(chat, case='camel')

@app.route('/chats/<int:chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    cookies = request.cookies
    user_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.get(id=chat_id)
    owner_id = chat['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    database.chats.delete(chat_id)
    return jsonify(), 205

@app.route('/chat-members/<int:chat_id>', methods=['POST'])
def add_chat_member(chat_id):
    params = converts_keys(request.args.to_dict(), case='snake')
    check_only_required_query_params(params, 'user_id')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.get(id=chat_id)
    owner_id = chat['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    database.chats.add_member(chat_id=chat_id, **params)
    return jsonify(), 201

@app.route('/chat-members/<int:chat_id>', methods=['DELETE'])
def remove_chat_member(chat_id):
    params = converts_keys(request.args.to_dict(), case='snake')
    check_only_required_query_params(params, 'user_id')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.get(id=chat_id)
    owner_id = chat['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    database.chats.remove_member(chat_id=chat_id, **params)
    return jsonify(), 205

@app.route('/chat-members/<int:chat_id>', methods=['GET'])
def get_chat_members(chat_id):
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    members = database.chats.get_members(chat_id=chat_id)
    for member in members:
        if user_id == member['user_id']:
            break
    else:
        return jsonify(), 403
    members = database.chats.get_members(chat_id=chat_id)
    return jsonify(converts_keys({'members': members}, case='camel')), 205
