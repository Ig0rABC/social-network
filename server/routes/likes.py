from flask import jsonify, request
from any_case import converts_keys
from settings import app, database


@app.route('/likes', methods=['POST'])
def like():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    if 'post_id' in params:
        database.posts.like(**params, **data)
    elif 'comment_id' in params:
        database.comments.like(**params, **data)
    elif 'reply_id' in params:
        database.replies.like(**params, **data)
    else:
        jsonify(), 400
    return jsonify({'message': 'Object has been tagged "I like"'})


@app.route('/likes', methods=['DELETE'])
def unlike():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    data = database.users.get_user_id(**cookies)
    if 'post_id' in params:
        database.posts.unlike(**params, **data)
    elif 'comment_id' in params:
        database.comments.unlike(**params, **data)
    elif 'reply_id' in params:
        database.replies.unlike(**params, **data)
    else:
        jsonify(), 400
    return jsonify({'message': 'Mark "I like" has been deleted from the object'})
