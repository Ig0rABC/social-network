from any_case import converts_keys
from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from psycopg2.errors import UniqueViolation
from flask import jsonify, request
from settings import app, DSN
from database import Users, Posts, Comments, Replies


@app.route('/likes', methods=['POST'])
def like():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            if 'post_id' in params:
                cursor.execute(Posts.like(), {**record, **params})
            elif 'comment_id' in params:
                cursor.execute(Comments.like(), {**record, **params})
            elif 'reply_id' in params:
                cursor.execute(Replies.like(), {**record, **params})
            else:
                jsonify(), 400
    return jsonify(), 201


@app.route('/likes', methods=['DELETE'])
def unlike():
    params = converts_keys(request.args.to_dict(), case='snake')
    cookies = request.cookies
    if 'token' not in cookies:
        return jsonify(), 401
    with connect(DSN) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(Users.get_user_id(), cookies)
            record = cursor.fetchone()
            if 'post_id' in params:
                cursor.execute(Posts.unlike(), {**record, **params})
            elif 'comment_id' in params:
                cursor.execute(Comments.unlike(), {**record, **params})
            elif 'reply_id' in params:
                cursor.execute(Replies.unlike(), {**record, **params})
            else:
                jsonify(), 400
    return jsonify(), 205
