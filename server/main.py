from logging.config import dictConfig
from settings import app, DEBUG, LOGGING_CONFIG
from flask import jsonify
from flask_cors import CORS
from exceptions import AppException
from routes import *

CORS(app)

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

@app.errorhandler(AppException)
def handle_error(error):
    app.logger.error(error.message)
    return jsonify(error.to_dict()), error.status_code

if __name__ == '__main__':
    if not DEBUG:
        dictConfig(LOGGING_CONFIG)
    app.run(debug=DEBUG)
