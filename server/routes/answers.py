from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_ANSWER_LIMIT,
    MAX_ANSWER_LIMIT
)

@app.route('/answers', methods=['POST'])
def create_answer():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.answers.create(**params, author_id=author_id)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/answers', methods=['GET'])
def get_answers():
    params = converts_keys(request.args.to_dict(), case='snake')
    params.setdefault('limit', DEFAULT_ANSWER_LIMIT)
    params['limit'] = int(params['limit'])
    if params['limit'] > MAX_ANSWER_LIMIT:
        params['limit'] = MAX_ANSWER_LIMIT
    params.setdefault('offset', 0)
    params['offset'] = int(params['offset'])
    return jsonify(converts_keys({
        'answers': database.answers.filter(**params),
        **database.answers.count(**params)
    }, case='camel'))

@app.route('/answers', methods=['PUT'])
def update_answer():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.answers.get_author_id(**params))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    data = database.answers.update(**params)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/answers', methods=['DELETE'])
def delete_answer():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.answers.get_author_id(**params))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    database.answers.delete(**params)
    return jsonify({'message': 'Answer has been deleted'})

@app.route('/answer-likes', methods=['POST'])
def like_answer():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    database.answers.like(**params, **data)
    return jsonify({'message': 'Answer has been tagged "I like"'})

@app.route('/answer-likes', methods=['DELETE'])
def unlike_answer():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    database.answers.unlike(**params, **data)
    return jsonify({'message': 'Mark "I like" has been deleted from the answer'})
