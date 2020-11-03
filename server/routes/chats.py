from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database

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
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    owner_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.create(**params, owner_id=owner_id)
    return jsonify(converts_keys(chat, case='camel')), 201

@app.route('/chats', methods=['PUT'])
def update_chat():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    user_id = database.users.get_user_id(**cookies)['user_id']
    owner_id = database.chats.get(id=params['id'])['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    chat = database.chats.update(**params)
    return jsonify(chat, case='camel')

@app.route('/chats', methods=['DELETE'])
def delete_chat():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    user_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.get(id=params['id'])
    owner_id = chat['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    database.chats.delete(**params)
    return jsonify(), 205

@app.route('/chat-members', methods=['POST'])
def add_chat_member():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.get(id=params['chat_id'])
    owner_id = chat['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    database.chats.add_member(**params)
    return jsonify(), 201

@app.route('/chat-members', methods=['DELETE'])
def remove_chat_member():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    chat = database.chats.get(id=params['chat_id'])
    owner_id = chat['owner_id']
    if user_id != owner_id:
        return jsonify(), 403
    database.chats.remove_member(**params)
    return jsonify(), 205

@app.route('/chat-members', methods=['GET'])
def get_chat_member():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)['user_id']
    members = database.chats.get_members(**params)
    for member in members:
        if user_id == member['user_id']:
            break
    else:
        return jsonify(), 403
    members = database.chats.get_members(**params)
    return jsonify(converts_keys({'members': members}, case='camel')), 205
