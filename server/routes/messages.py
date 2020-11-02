from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database

@app.route('/messages', methods=['GET'])
def get_messages():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    messages = database.messages.filter(**params, **data)
    return jsonify(converts_keys({'messages': messages}, case='camel'))

@app.route('/messages', methods=['POST'])
def create_messages():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    message = database.messages.create(author_id=author_id, **params)

@app.route('/messages', methods=['PUT'])
def update_message():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)
    message = database.messages.get(id=params['id'])
    author_id = message['author_id']
    if user_id != author_id:
        return jsonify(), 401
    message = database.messages.update(**params)
    return jsonify(converts_keys({'message': message}, case='camel'))

@app.route('/messages', methods=['DELETE'])
def delete_message():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    user_id = database.users.get_user_id(**cookies)
    message = database.messages.get(id=params['id'])
    author_id = message['author_id']
    if user_id != author_id:
        return jsonify(), 401
    database.messages.delete(**params)
    return jsonify(), 205

@app.route('/last-messages', methods=['GET'])
def get_last_messages():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    messages = database.messages.get_last_messages(**data)
    return jsonify(converts_keys({'messages': messages}, case='camel'))
