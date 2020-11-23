from json import loads
from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    LOGIN_VALIDATOR,
    PASSWORD_VALIDATOR
)
from .utils import are_only_required_params

@app.route('/users/register', methods=['POST'])
def register():
    params = converts_keys(loads(request.data), case='snake')
    if not are_only_required_params(params, 'login', 'password'):
        return jsonify(), 401
    if not LOGIN_VALIDATOR.fullmatch(params['login']):
        return jsonify({'message': 'Incorrect login'}), 401
    if not PASSWORD_VALIDATOR.fullmatch(params['password']):
        return jsonify({'message': 'Incorrect password'}), 401
    data = database.users.register(**params)
    if not data:
        return jsonify({'message': 'User with this login already exists. Please, enter another'}), 401
    database.profiles.create(**data)
    database.contacts.create(**data)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/users/login', methods=['POST'])
def login():
    params = converts_keys(loads(request.data), case='snake')
    if not are_only_required_params(params, 'login', 'password'):
        return jsonify(), 401
    if 'token' in request.cookies:
        database.users.logout(**request.cookies)
    data = database.users.login(**params)
    if not data:
        return jsonify({'message': 'Authorization error'}), 401
    response = make_response('Cookies', 200)
    response.set_cookie('token', value=data['token'])
    return response

@app.route('/users/login', methods=['DELETE'])
def logout():
    database.users.logout(**request.cookies)
    response = make_response(jsonify({'message': 'Logout has been completed successfully'}), 205)
    response.set_cookie('token', value='', max_age=0)
    return response
