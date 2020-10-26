from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database

@app.route('/users/register', methods=['POST'])
def register():
    params = converts_keys(request.args.to_dict(), case='snake')
    data = database.users.register(**params)
    if not data:
        return jsonify({'message': 'User with this login already exists'})
    return jsonify(converts_keys(data, case='camel'))

@app.route('/users/login', methods=['POST'])
def login():
    params = request.args.to_dict()
    data = database.users.login(**params)
    if not data:
        return jsonify({'message': 'User already logged'})
    response = make_response('Cookies', 200)
    response.set_cookie('token', value=data['token'])
    return response

@app.route('/users/logout', methods=['DELETE'])
def logout():
    database.users.logout(**request.cookies)
    response = make_response('Cookie removed', 200)
    response.set_cookie('token', value='', max_age=0)
    return jsonify({'message': 'Logout complete successfuly'})
