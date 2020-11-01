from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database

@app.route('/chats', methods=['GET'])
def get_chats():
    cookies = request.cookies
    data = database.users.get_user_id(**cookies)
    chats = database.chats.filter(**data)
    return jsonify(converts_keys(chats, case='camel'))

@app.route('/chats/own', methods=['GET'])
def get_own_chats():
    cookies = request.cookies
    owner_id = database.users.get_user_id(**cookies)['user_id']
    chats = database.chats.filter(owner_id=owner_id)
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
        return jsonify(), 401
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
        return jsonify(), 401
    database.chats.delete(**params)
    return jsonify(), 205
