from settings import app
from flask_cors import CORS
from routes import *

CORS(app)

@app.after_request
def after_request(response):
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
  response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
  response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
  response.headers['Access-Control-Allow-Credentials'] = 'true'
  return response

if __name__ == '__main__':
    app.run(debug=False)
