from   flask import Flask, request, current_app, send_from_directory, jsonify
from   flask.ext.cors import CORS, cross_origin
from flask import Response


# from   flask.ext.API import status
import json
import os
import taxonomy_api
import traceback

app = Flask(__name__, static_url_path='', static_folder="/")
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

dists_and_wins, all_tasks = taxonomy_api.load_affinities()
priorities = taxonomy_api.load_priorities()
task_to_set, minimal_tasks_to_set = taxonomy_api.get_default_sets(all_tasks, dists_and_wins)
map_to_display_names = taxonomy_api.map_to_display_names

@app.route('/viz', methods=['GET'])
def viz_html():
    try:
        return app.send_static_file('api.html'), 200
    except:
        traceback.print_exc()
        raise

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'viz'), 'favicon.ico', mimetype='image/x-icon')

# Call the API solver with params
@app.route('/solve', methods=['GET','POST'])
def solve():
    # print(res)
    api_params = request.get_json()
    print(api_params.keys())
    # print(api_params['tasks'])
    print(api_params['supervision']['children'][1])
    supervision_accordion = api_params['supervision']
    unused = api_params['tasks']['unused']
    src_only_tasks = api_params['tasks']['src_only_tasks']
    target_only_tasks = api_params['tasks']['target_only_tasks']
    targets = api_params['tasks']['targets']
    try:
        dists, dists_for_task, dists_for_pix, wins_v_task, wins_v_pixels = taxonomy_api.get_dists_for_options(
            dists_and_wins, supervision_accordion, taxonomy_api.DEFAULTS
        )
        dists_to_use = {'Affinity': dists, 'Quality v Task': dists_for_task, 'Quality v Pixels': dists_for_pix}
        dists_to_use = dists_to_use['Affinity']
        print("Hardcoding Affinity Use")
        res = taxonomy_api.solve_BIP(unused, src_only_tasks, target_only_tasks, targets, supervision_accordion, dists_to_use)
        total_affinity, sol, affinities, TRANSFER_NAMES, SRC_TASKS, TARGET_ONLY_TASKS = res
        if sol.value is None:
            raise ValueError("No solution found!")
        
        G = taxonomy_api.make_graph(sol.value, affinities, TRANSFER_NAMES, SRC_TASKS + TARGET_ONLY_TASKS, priorities)
        print(G.edges())
        TRANSFER_VALS = taxonomy_api.create_cost_dict(affinities, dists, wins_v_task, wins_v_pixels, TRANSFER_NAMES, SRC_TASKS, targets)
        print("Goodness: {:.2f}".format(total_affinity))
    except Exception as e: 
        traceback.print_exc()
        if request.method == 'POST':
            return "UNSATISFIABLE", 400
        raise

    # taxonomy_api.solve_BIP(unused, src_only_tasks, target_only_tasks, targets, supervision_accordion, dists_and_wins):

    if request.method == 'POST':
        # response = flask.jsonify(taxonomy_api.get_graph(G, TRANSFER_VALS, TRANSFER_NAMES, 
        #     SRC_TASKS + TARGET_ONLY_TASKS, targets + TARGET_ONLY_TASKS,
        #     color='Groups'))
        # response.headers.add('Access-Control-Allow-Origin', '*')
        # return response
        return json.dumps(taxonomy_api.get_graph(G, TRANSFER_VALS, TRANSFER_NAMES, 
            SRC_TASKS + TARGET_ONLY_TASKS, targets + TARGET_ONLY_TASKS,
            color='Groups')), 200

# Get each task and it's suggested set (unused, target, etc)
@app.route('/defaults', methods=['GET'])
def defaults():
    return json.dumps({
        'task_id_to_set': task_to_set,
        'task_id_to_display_name': map_to_display_names
    }), 200



@app.route('/ping', methods=['GET'])
def ping():
    return "OK", 200, {'content-length':'2'} 


# @app.after_request
# def after_request(response):
#   response.headers.add('Access-Control-Allow-Origin', '*')
#   response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#   response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#   return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=8887, threaded=True)