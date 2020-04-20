from   flask import Flask, request, current_app
from   flask.ext.cors import CORS, cross_origin
import json
import traceback

app = Flask(__name__, static_url_path='', static_folder="/")
cors = CORS(app, resources={
    r"/defaults": {"origins": "*"},
    r"/solve": {"origins": "*"}
})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/viz', methods=['GET'])
def index():
    try:
        return app.send_static_file('demo-particles.html'), 200
    except:
        traceback.print_exc()
        raise


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)