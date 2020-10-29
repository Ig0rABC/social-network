from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import (
    app, database,
    DEFAULT_COMMENT_LIMIT,
    MAX_COMMENT_LIMIT
)

@app.route('/comments', methods=['POST'])
def create_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.comments.create(**params, author_id=author_id)
    return jsonify(converts_keys(data, case='camel')), 201

@app.route('/comments', methods=['GET'])
def get_comments():
    params = converts_keys(request.args.to_dict(), case='snake')
    params.setdefault('limit', DEFAULT_COMMENT_LIMIT)
    params['limit'] = int(params['limit'])
    if params['limit'] > MAX_COMMENT_LIMIT:
        params['limit'] = MAX_COMMENT_LIMIT
    params.setdefault('offset', 0)
    params['offset'] = int(params['offset'])
    return jsonify(converts_keys({
        'comments': database.comments.filter(**params),
        **database.comments.count(**params)
    }, case='camel'))

@app.route('/comments', methods=['PUT'])
def update_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.comments.get_author_id(**params))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    data = database.comments.update(**params)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/comments', methods=['DELETE'])
def delete_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = {}
    data.update(database.users.get_user_id(**cookies))
    data.update(database.comments.get_author_id(**params))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    database.comments.delete(**params)
    return jsonify({'message': 'Comment has been deleted'})

@app.route('/comments/likes', methods=['POST'])
def like_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    database.comments.like(**params, **data)
    return jsonify({'message': 'Comment has been tagged "I like"'})

@app.route('/comments/likes', methods=['DELETE'])
def unlike_comment():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    database.comments.unlike(**params, **data)
    return jsonify({'message': 'Mark "I like" has been deleted from the comment'})
