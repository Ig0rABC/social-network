from json import loads
from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    LOGIN_VALIDATOR,
    PASSWORD_VALIDATOR
)
from .utils import check_only_required_payload_props
from settings import REMEMBER_ME_MAX_AGE

@app.route('/users/register', methods=['POST'])
def register():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(payload, 'login', 'password')
    if not LOGIN_VALIDATOR.fullmatch(payload['login']):
        return jsonify({'message': 'Incorrect login'}), 401
    if not PASSWORD_VALIDATOR.fullmatch(payload['password']):
        return jsonify({'message': 'Incorrect password'}), 401
    data = database.users.register(**payload)
    if not data:
        return jsonify({
            'message': 'User with this login already exists'
        }), 401
    database.profiles.create(**data)
    database.contacts.create(**data)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/users/login', methods=['POST'])
def login():
    payload = converts_keys(loads(request.data), case='snake')
    check_only_required_payload_props(
        payload, 'login', 'password', 'remember_me'
    )
    if 'token' in request.cookies:
        database.users.logout(**request.cookies)
    data = database.users.login(**payload)
    if not data:
        return jsonify(), 401
    token = data.pop('token')
    if payload['remember_me']:
        max_age = REMEMBER_ME_MAX_AGE
    else:
        max_age = None
    response = make_response(jsonify(converts_keys(data, case='camel')), 201)
    response.set_cookie(
        'token',
        value=token,
        max_age=max_age,
        samesite=None,
        secure=False,
        httponly=False
    )
    return response

@app.route('/users/login', methods=['DELETE'])
def logout():
    database.users.logout(**request.cookies)
    response = make_response(jsonify(), 205)
    response.set_cookie(
        'token',
        value='',
        max_age=0,
        samesite=None,
        secure=False,
        httponly=False
    )
    return response

@app.route('users/me', methods=['GET'])
def me():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    data = database.users.me(**data)
    return jsonify(converts_keys(data, case='camel'))
