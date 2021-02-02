import json
from any_case import converts_keys
from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from psycopg2.errors import UniqueViolation
from flask import jsonify, request, make_response
from settings import app, DSN, REMEMBER_ME_MAX_AGE
from database import Users, Profiles, Contacts
from .utils import (
    check_only_required_payload_props,
    put_out_contacts,
    validate_login,
    validate_password,
    validate_contacts
)
from exceptions import (
    NotUniqueLoginError,
    AuthenticationError
)

@app.route('/users/register', methods=['POST'])
def register():
    try:
        payload = converts_keys(json.loads(request.data), case='snake')
    except ValueError:
        raise EmptyPayloadError
    check_only_required_payload_props(payload, 'login', 'password')
    validate_login(payload['login'])
    validate_password(payload['password'])
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            try:
                cursor.execute(Users.register(), payload)
            except UniqueViolation:
                raise NotUniqueLoginError
            data = cursor.fetchone()
            cursor.execute(Profiles.create(), data)
            cursor.execute(Contacts.create(), data)
    return jsonify(), 201

@app.route('/users/login', methods=['POST'])
def login():
    try:
        payload = converts_keys(json.loads(request.data), case='snake')
    except ValueError:
        raise EmptyPayloadError
    check_only_required_payload_props(
        payload, 'login', 'password', 'remember_me'
    )
    if payload.pop('remember_me'):
        max_age = REMEMBER_ME_MAX_AGE
    else:
        max_age = None
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            if 'token' in request.cookies:
                try:
                    cursor.execute(Users.logout(), request.cookies)
                except Exception:
                    pass
            cursor.execute(Users.login(), payload)
            record = cursor.fetchone()
            try:
                token = record['token']
            except TypeError:
                raise AuthenticationError
    response = make_response(jsonify(), 201)
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
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.logout(), request.cookies)
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

@app.route('/users/me', methods=['GET'])
def me():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            cursor.execute(Users.me(), record)
            me = cursor.fetchone()
    return jsonify(converts_keys(me, case='camel'))

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_data(user_id):
    cookies = request.cookies
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            if 'token' in cookies:
                cursor.execute(Users.get_user_id(), cookies)
                record = cursor.fetchone()
                try:
                    follower_id = record['user_id']
                except KeyError:
                    cursor(Users.logout(), cookies)
                    follower_id = 0
            else:
                follower_id = 0
            cursor.execute(Users.get_user_data(), {
                'id': user_id,
                'follower_id': follower_id
            })
            profile = cursor.fetchone()
        put_out_contacts(profile)
        return jsonify(converts_keys(profile, case='camel'))

@app.route('/users', methods=['PUT'])
def update_user_data():
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    try:
        payload = converts_keys(json.loads(request.data), case='snake')
    except json.decoder.JSONDecodeError:
        raise EmptyPayloadError
    profile = payload
    contacts = profile.pop('contacts')
    validate_contacts(contacts)
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            if profile:
                cursor.execute(Profiles.update(profile), {**record, **profile})
            if contacts:
                cursor.execute(Contacts.update(contacts), {**record, **contacts})
    return jsonify(), 204
