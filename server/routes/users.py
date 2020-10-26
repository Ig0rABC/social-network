from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database

@app.route('/users/register', methods=['POST'])
def register():
    params = converts_keys(request.args.to_dict(), case='snake')
    if not (params.get('login') and params.get('password')):
        return jsonify({'message': 'No login or password'}), 401
    data = database.users.register(**params)
    if not data:
        return jsonify({'message': 'User with this login already exists'}), 401
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/users/login', methods=['POST'])
def login():
    params = request.args.to_dict()
    data = database.users.login(**params)
    if not data:
        return jsonify({'message': 'Authorization error'}), 401
    response = make_response('Cookies', 200)
    response.set_cookie('token', value=data['token'])
    return response

@app.route('/users/logout', methods=['DELETE'])
def logout():
    database.users.logout(**request.cookies)
    response = make_response('Cookie removed', 200)
    response.set_cookie('token', value='', max_age=0)
    return jsonify({'message': 'Logout complete successfuly'})
