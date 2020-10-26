from flask import jsonify, request, make_response
from settings import app, database

@app.route('/users/register', methods=['POST'])
def register():
    params = request.args.to_dict()
    user_id = database.users.register(**params)
    return jsonify({'userId': user_id})

@app.route('/users/login', methods=['POST'])
def login():
    params = request.args.to_dict()
    token = database.users.login(**params)
    response = make_response('Cookies', 200)
    response.set_cookie('token', value=token, path=request.path)
    return response

@app.route('/users/logout', methods=['DELETE'])
def logout():
    database.users.logout(**request.cookies)
    response = make_response('Cookie removed')
    response.set_cookie('token', value='', max_age=0)
    return jsonify({'message': 'Logout complete successfuly'})
