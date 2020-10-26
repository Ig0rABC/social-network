from flask import jsonify, request, make_response
from any_case import converts_keys
from settings import app, database

@app.route('/posts/categories', methods=['GET'])
def get_categories():
    categories = database.posts.get_categories()
    return jsonify({'categories': categories})

@app.route('/posts', methods=['POST'])
def create_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    author_id = database.users.get_user_id(**cookies)['user_id']
    data = database.posts.create(**params, author_id=author_id)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/posts', methods=['GET'])
def get_posts():
    params = converts_keys(request.args.to_dict(), case='snake')
    posts = database.posts.filter(**params)
    return jsonify({'posts': posts})

@app.route('/posts', methods=['PUT'])
def update_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    data = {}
    data.update(database.posts.get_author_id(**params))
    data.update(database.users.get_user_id(**cookies))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    data = database.posts.update(**params)
    return jsonify(converts_keys(data, case='camel'))

@app.route('/posts', methods=['DELETE'])
def delete_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    data = {}
    data.update(database.posts.get_author_id(**params))
    data.update(database.users.get_user_id(**cookies))
    if data['user_id'] != data['author_id']:
        return jsonify({'messages': 'Access error'})
    database.posts.delete(**params)
    return jsonify({'message': 'Post has been deleted'})

@app.route('/posts/likes', methods=['POST'])
def like_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    data = database.users.get_user_id(**cookies)
    database.posts.like(**params, **data)
    return jsonify({'message': 'Post has been tagged "I like"'})

@app.route('/posts/likes', methods=['DELETE'])
def unlike_post():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    data = database.users.get_user_id(**cookies)
    database.posts.unlike(**params, **data)
    return jsonify({'message': 'Mark "I like" has been deleted from the post'})

@app.route('/posts/likes', methods=['GET'])
def count_post_likes():
    params = converts_keys(request.args.to_dict(), case='snake')
    data = database.posts.count_likes(**params)
    return jsonify(converts_keys(data, case='camel'))
