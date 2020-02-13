# Name: taxonomy_api.py
# Desc: Backend code to support the taxonomy solver. This is loaded in the 
#   jupyter notebook.

from   collections import defaultdict
import copy
from   cvxpy import *
# import ipywidgets as widgets
import pickle as pkl
import numpy as np
import networkx as nx
import sys
# from   IPython.core.display import HTML, clear_output

# import assets.d3_lib as d3_lib
import assets.d3_lib as d3_lib
G, transfer_vals, transfer_names, src_tasks = None, [], [], []

SIMPLE_INTERFACE = False

DEFAULTS = { 
    'DEFAULT_TASK_VALUE': 1.0,
    'DEFAULT_FULL_SUPERVISION_COST': 1.0,
    'DEFAULT_TRANSFER_SUPERVISION_COST': 0.0,
    'DEFAULT_SUPERVISION_BUDGET': 6.0,
    'DEFAULT_MAX_ORDER': 5,
    'TRANSFER_SUPERVISION_AMOUNTS': [1,16]
}

# OPTIMIZER_TAB_INTERFACE = widgets.ToggleButtons(
#         options=['Affinity', 'Quality v Task', 'Quality v Pixels'],
#         description='Optimize for:',
#         disabled=False,
#         button_style='', # 'success', 'info', 'warning', 'danger' or ''
#         tooltips=['Task affinity', 'Win rate v Task-Specific', 'Win rate v Pixels' ],
#     #     icons=['check'] * 3
#     )

# OPTIMIZER_BUTTON_INTERFACE = widgets.Button(description='Solve!',
#            layout=widgets.Layout(width='68.25%', height='40px'),
#            button_style='success')

VIZ_OPTIONS = ['Groups', 'Affinity', 'Quality v Task', 'Quality v Pixels']
VIZ_TOOLTIPS = [
            'Color the graph based on node groups',
            'Color the nodes based on how strongly this configuration is preferred',
            'Color the graph based on improvement over full supervision',
            'Color the graph based on improvement over training from scratch on images',
            ]
if SIMPLE_INTERFACE:
    VIZ_OPTIONS = ['Groups', 'Quality v Task', 'Quality v Pixels']
    VIZ_TOOLTIPS = [
            'Color the graph based on node groups',
            'Color the graph based on improvement over full supervision',
            'Color the graph based on improvement over training from scratch on images',
            ]
# VIZ_TAB_INTERFACE = widgets.ToggleButtons(
#         options=VIZ_OPTIONS,
#         description='Coloring Type:',
#         disabled=False,
#         button_style='primary', # 'success', 'info', 'warning', 'danger' or '',
#         tooltips=VIZ_TOOLTIPS,
#     #     icons=['check'] * 3
#     )


# Load affinities
map_to_display_names = {
    'autoencoder': 'Autoencoding',
    'curvature': 'Curvature',
    'class_places': 'Scene Class.',
    'denoise': 'Denoising',
    'edge2d': '2D Edges',
    'edge3d': 'Occlusion Edges',
    'ego_motion': 'Egomotion',
    'fix_pose': 'Cam. Pose (fix)',
    'keypoint2d': '2D Keypoints',
    'keypoint3d': '3D Keypoints',
    'non_fixated_pose': 'Cam. Pose (nonfix)',
    'point_match': 'Matching',
    'reshade': 'Reshading',
    'rgb2depth': 'Z-Depth',
    'rgb2mist': 'Distance',
    'rgb2sfnorm': 'Normals',
    'room_layout': 'Layout',
    'segment25d': '2.5D Segm.',
    'segment2d': '2D Segm.',
    'vanishing_point_well_defined': 'Vanishing Pts.',
    'segmentsemantic_rb': 'Semantic Segm.',
    'class_selected': 'Object Class. (100)',
    'class_1000': 'Object Class. (1000)',
    'random': 'Random Proj.',
    'self': 'Task-Specific',
    'pixels': 'Only Image',
    'impainting_whole': 'In-painting',
    'colorization': 'Colorization',
    'jigsaw': 'Jigsaw', 
}

def load_priorities():
    DATA_VAL_NAMES = [str(v) + 'k' for v in DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']]
    priorities = defaultdict(dict)
    for i, data_val in enumerate(DATA_VAL_NAMES):
        with open("assets/first_order_affinity_matrix_{}.pkl".format(data_val), 'rb') as f:
            dists = pkl.load(f)
            for i, row in enumerate(dists['rows']):
                for j, col in enumerate(dists['cols']):
                    priorities[map_to_display_names[row]][map_to_display_names[col[0]]] = np.sqrt(dists['vals'][i,j])
            # for k, v in dists.items():
            #     priorities[k] = np.sqrt(v)
    return priorities

def load_affinities():
    all_tasks = set()
    DATA_VAL_NAMES = [str(v) + 'k' for v in DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']]
    dists_and_wins = {}
    for i, data_val in enumerate(DATA_VAL_NAMES):
        with open("assets/all_affinities_{}.pkl".format(data_val), 'rb') as f:
            dists = pkl.load(f)
            for k, v in dists.items():
                dists[k] = np.sqrt(v)
        with open("assets/wins_vs_task_{}.pkl".format(data_val), 'rb') as f:
            wins_v_task = pkl.load(f)
        # if data_val == '16k':
        with open("assets/wins_vs_pixels_{}.pkl".format(data_val), 'rb') as f:
            wins_v_pixels = pkl.load(f)
        # else: 
        #     wins_v_pixels = wins_v_task
        dists_for_task, dists_for_pix = get_dists_for_task_and_pix(dists, wins_v_task, wins_v_pixels)
        dists_and_wins[DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS'][i]] = \
            dists, dists_for_task, dists_for_pix, wins_v_task, wins_v_pixels
        all_tasks.update([v.split("__")[0] for v in dists.keys()]) # All tasks which can transfer TO another    
    all_tasks = sorted(all_tasks)
    all_tasks.remove('self')
    return dists_and_wins, all_tasks

def get_default_sets(all_tasks, dists_and_wins):
    for k, v in dists_and_wins.items():
        dists, _, _, _, _ = v
    task_to_set = {}

    for task in sorted(set(all_tasks)): # All tasks which can transfer TO another
        task_to_set[task] = 'unused'
        task_to_set[task] = 'src_only_tasks'
    for task in sorted(set([v.split("__")[-1] for v in dists.keys()])):  # All tasks which can RECEIVE transfers
        task_to_set[task] = 'targets'
    task_to_set['class_selected'] = 'unused'

    minimal_tasks_to_set = {} 
    for task in task_to_set.keys():
        minimal_tasks_to_set[task] = 'unused'
    minimal_tasks_to_set['rgb2sfnorm'] = 'targets'
    minimal_tasks_to_set['vanishing_point_well_defined'] = 'targets'
    minimal_tasks_to_set['room_layout'] = 'targets'
    return task_to_set, minimal_tasks_to_set

def get_dists_for_task_and_pix(dists, wins_v_task, wins_v_pixels):
    dists_for_pix = {}
    for k in dists:
        dists_for_pix[k] = wins_v_pixels[k]

    dists_for_task = {}
    for k in dists:
        dists_for_task[k] = wins_v_task[k]

    return dists_for_task, dists_for_pix

def root_cost(src, self_tasks, src_only_tasks):
    if src in src_only_tasks:
        return 0.0
    if "self__" + src in self_tasks:
        return self_tasks["self__" + src]
    else:
        raise ValueError("Unknown self-transfer: ({})".format(src))

def get_viable_transfers(dists, target_only_tasks, src_only_tasks, unused, max_order):
    # Take out transfers to 'src_only' and 'unused' tasks
    forbidden_sources = set(['self'] + unused) #, 'colorization', 'jigsaw', 'random', 'impainting_whole'])
    forbidden_targets = set(['self'] + src_only_tasks + unused) #'colorization', 'jigsaw', 'random', 'impainting_whole'])
    dists_copy = copy.deepcopy(dists)

    def is_bad(name):
        tasks = name.split("__")
        bad_srcs = set(tasks[:-1]) & (forbidden_sources | set([tasks[-1]])) # If source forbidden or == target
        bad_srcs |= set(tasks[:-1]) & set(target_only_tasks)
        return len(bad_srcs) > 0 or tasks[-1] in forbidden_targets or len(tasks[:-1]) > max_order

    def is_bad_target(name):
        tasks = name.split("__")
        bad_srcs = set(tasks[:-1]) & (forbidden_sources | set([tasks[-1]])) # If source forbidden or == target
        return tasks[-1] in forbidden_targets # or len(tasks[:-1]) > max_order

    bad_cols = [b for b in dists_copy.keys() if is_bad(b)]
    good_cols = [b for b in dists_copy.keys() if not is_bad(b)]
    self_tasks = {}
    for c in bad_cols:
        self_tasks[c] = dists_copy[c]
        del dists_copy[c]
    print("Keeping {}/{} transfers, rejecting {}".format(len(good_cols), len(dists), len(bad_cols)))
    # for t in sorted(bad_cols):
    #     print(t)
    return dists_copy, self_tasks

def get_present(src_only_tasks, target_only_tasks, targets):
    # Initial src and targets
    src_tasks = sorted(src_only_tasks + targets)      # All tasks which can transfer TO another
    target_tasks = sorted(targets)  # All tasks which can RECEIVE transfers
    return src_tasks, target_tasks

def get_key_info(src_tasks, dists):
    edge_names = sorted(dists.keys())                                      # Each hypergraph edge is a transfer
    src_to_idx = {src: i + len(edge_names) for i, src in enumerate(src_tasks) } # Each src_task can be a root
    key_order = edge_names + src_tasks                                     # A list of all the EDGES | SOURCES
    return edge_names, src_to_idx, key_order

def get_ojective_affinities_vector(dists, edge_names, src_tasks, self_tasks, src_only_tasks, target_only_tasks):
    # The affinities of each transfer
    for k in edge_names:
        if 'self' in k:
            print(k)
    # Costs are either transfer cost, root cost, or zero (since targets can't be source)
    costs = [dists[k] for k in edge_names] + \
        [root_cost(src, self_tasks, src_only_tasks) for src in src_tasks] + \
        [0 for dst in target_only_tasks]
    costs = np.array(costs)[np.newaxis, :]
    costs = np.clip(costs, 1e-5, 1.)
    print(costs)
    # costs = np.log(costs)
    return costs

def make_edge_constraints(var_to_optimize, costs, dists, src_tasks, src_only_tasks, src_to_idx, target_only_tasks,  edge_names):
    """ 
        costs: the objective vector for costs
    """
    # Each node must have one incoming edge, or be a root
    n_edges_per_node_constraint = defaultdict(lambda: np.zeros(costs.size, dtype=np.int32))
    n_max_edges_per_node = np.ones(len(src_tasks + target_only_tasks))
    n_min_edges_per_node = np.ones(len(src_tasks + target_only_tasks))

    for i, src in enumerate(src_tasks):
        n_edges_per_node_constraint[src][src_to_idx[src]] = 1
        if src in src_only_tasks: #TODO(sasha): add source-only constraints
            n_min_edges_per_node[i] = 0

    # Each edge 'i' is order 'k', and of the form 
    # [0, 0, 0 ... -k ... 0, 0 | 0 , 1, ..., 0, 1, 0, ... 0, 1, 0, ...] with 'k' ones on the r.h.s.
    #               ^ idx = i
    edge_constraint = np.zeros((len(dists.keys()), costs.size), dtype=np.int32)
    for i, task in enumerate(edge_names):
        tasks = task.split("__")
        srcs, dst = tasks[:-1], tasks[-1]
        for s in srcs:
            edge_constraint[i, src_to_idx[s]] = 1
        edge_constraint[i, i] = -len(srcs)
        n_edges_per_node_constraint[dst][i] = 1  # This enforces edge XOR root

    edge_constraint_val = np.zeros(len(edge_constraint))

    # Stack all of the n_edge constraints
    n_edges_constraint = [] # Make sure each node has at most one incoming transfer (maybe multi-source)
    n_min_edges_constraint = [] # Source-only tasks have min transfers = 0. Otherwise, 1.

    for i, src in enumerate(src_tasks):
        assert src in n_edges_per_node_constraint, "Unexpected source node"
        n_edges_per_node_constraint[src][src_to_idx[src]] = 1  # Self-connection costs one 
        n_edges_constraint.append(n_edges_per_node_constraint[src])
        del n_edges_per_node_constraint[src]
    
    for i, dst in enumerate(target_only_tasks):
        assert dst in n_edges_per_node_constraint, "Unexpected target_only node"
        n_edges_constraint.append(n_edges_per_node_constraint[dst])
        del n_edges_per_node_constraint[dst]

    n_edges_constraint = np.stack(n_edges_constraint)

    assert len(n_edges_per_node_constraint) == 0, "Some edge constraints do not seem to correspond to any node"

    # print('var_shape', var_to_optimize.size)
    # print('edge_constraint', edge_constraint.shape)
    # print('edge_constraint_val', edge_constraint_val.shape)
    # print('n_edges_constraint', n_edges_constraint.shape)
    # print('n_edges_per_node', n_edges_per_node.shape)
    return  [
        edge_constraint * var_to_optimize >= edge_constraint_val, 
        n_edges_constraint * var_to_optimize <= n_max_edges_per_node,
        n_edges_constraint * var_to_optimize >= n_min_edges_per_node
    ]


def make_supervision_budget_constraints(
    variable_to_optimize,
    edge_names,
    src_tasks,
    target_only_tasks,
    transfer_costs_for_task,
    supervision_costs_for_task,
    budget
):
    # Cost of acquiring labels for each src and transfer: for BIP
    transfer_costs = [transfer_costs_for_task[transfer.split("__")[-1]] for transfer in edge_names]
    root_costs = [supervision_costs_for_task[s] for s in src_tasks]
    target_only_costs = [0 for t in target_only_tasks]
    supervision_constraints = transfer_costs + root_costs + target_only_costs #TODO can also make large
    # print('supervision_constraints', len(supervision_constraints))
    # supervision_constraints = [0] * len(edge_names) + [1 for src in src_tasks]
    supervision_budget = [budget], 
    return [np.array(supervision_constraints)[np.newaxis, :] * variable_to_optimize <= np.array(supervision_budget)[np.newaxis, :]]

def get_supervision_cost_for_tasks(all_tasks, supervision_parent_accordion):
    # Read out the cost of acquiring labels for each src and transfer
    supervision_accordion = supervision_parent_accordion['children'][0]['children'][0]
    transfer_accordion = supervision_parent_accordion['children'][0]['children'][1]

    supervision_costs_for_task = {}
    transfer_costs_for_task = {}
    for i, t in enumerate(all_tasks):
        supervision_costs_for_task[t] = supervision_accordion['children'][i]['value']
        transfer_costs_for_task[t] = transfer_accordion['children'][i]['value']
    return supervision_costs_for_task, transfer_costs_for_task

def get_supervision_budget(supervision_accordion):
    return supervision_accordion['children'][1]['value']

def get_relative_task_values(all_tasks, supervision_parent_accorion):
    relative_value_list = supervision_parent_accorion['children'][3]
    res = {}
    for i, task in enumerate(all_tasks):
        res[task] = relative_value_list['children'][i]['value']
    return res

def get_max_order(supervision_accordion):
    return supervision_accordion['children'][2]['value']

def get_data_size_str(supervision_costs, DEFAULTS):
    min_val, max_val = supervision_costs.children[4].value
    valid_vals = [v 
        for v in DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']
        if min_val <= v and v <= max_val
    ]
    if len(valid_vals) > 1:
        raise NotImplementedError("The API does not currently support optimizing over mixed transfer sizes ({}). Please reduce the acceptable range so that it includes just one of these values.".format(
            valid_vals
        ))
    return str(valid_vals[0]) + 'k'

def get_dists_for_options(dists_and_wins, supervision_costs, DEFAULTS):
    min_val, max_val = supervision_costs['children'][4]['value']
    valid_vals = [v 
        for v in DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']
        if min_val <= v and v <= max_val
    ]
    if len(valid_vals) > 1:
        raise NotImplementedError("The API does not currently support optimizing over mixed transfer sizes ({}). Please reduce the acceptable range so that it includes just one of these values.".format(
            valid_vals
        ))
    return dists_and_wins[valid_vals[0]]


def scale_costs_by_relative_task_values(costs, relative_task_values, key_order):
    for i, transfer in enumerate(key_order):
        dst = transfer.split("__")[-1]
        costs[:, i] *= relative_task_values[dst]
    return costs

def convert_to_json(accordion):
    if accordion._model_name == 'IntSliderModel' or \
        accordion._model_name == 'FloatTextModel':
        return {
            'description': accordion.description,
            'value': accordion.value
        }
    return {
        '_titles': accordion._titles,
        'children': [convert_to_json(c) for c in accordion.children]
    }

import pdb
def solve_BIP(unused, src_only_tasks, target_only_tasks, targets, supervision_accordion, dists,):
    """
        Makes a Boolean Program for the taxonomy and solves it.

        Returns:
            affinity: The total affinity achieved by the taxonomy
            x: The solution, containing the taxonomy
            cost: The affinity for each x
            transfer_names: The names corresponding to each transfer in 'x'
            src_tasks: The names corresponding to each src in 'x' (the labels for x are transfer_names | src_tasks)
    """
    all_tasks = sorted(set(unused + src_only_tasks + targets + target_only_tasks) - set())
    present_tasks = sorted(set(src_only_tasks + targets + target_only_tasks) - set())
    src_tasks = sorted(set(src_only_tasks + targets) - set())
    target_tasks = sorted(set(target_only_tasks + targets) - set())

    # supervision_json = convert_to_json(supervision_accordion)
    supervision_json = supervision_accordion
    budget = get_supervision_budget(supervision_json)
    print("Budget:", budget)
    # Get user-defined parameters for the problem
    supervision_costs_for_task, transfer_costs_for_task = get_supervision_cost_for_tasks(
        all_tasks,
        supervision_json
    )
    max_order = get_max_order(supervision_json)
    relative_task_values = get_relative_task_values(all_tasks, supervision_json)
    # print(get_relative_task_values)
    # src_tasks, target_tasks = get_src_present_(src_only_tasks, targets)

    # Use the experimentally tested transfer distances
    dists, self_tasks = get_viable_transfers(dists, target_only_tasks, src_only_tasks, unused, max_order)
    edge_names, src_to_idx, key_order = get_key_info(src_tasks, dists)

    # Set up BIP
    c = get_ojective_affinities_vector(dists, edge_names, src_tasks, self_tasks, src_only_tasks, target_only_tasks)
    c = scale_costs_by_relative_task_values(c, relative_task_values, key_order)
    x = Bool(len(edge_names) + len(present_tasks))
    edge_constraints = make_edge_constraints(x, c, dists, src_tasks, src_only_tasks, src_to_idx, target_only_tasks, edge_names)
    supervision_constraints = make_supervision_budget_constraints(
        x,
        edge_names,
        src_tasks,
        target_only_tasks,
        transfer_costs_for_task,
        supervision_costs_for_task,
        get_supervision_budget(supervision_json)
    )
    
    obj = Maximize(c * x)
    constraints = edge_constraints + supervision_constraints
    prob = Problem(obj, constraints)
    total_affinity = prob.solve(solver='GLPK_MI')
    return total_affinity, x, c, edge_names, src_tasks, target_only_tasks



############################### 
#           VISUALS           #
###############################
# G = []
# TRANSFER_VALS = []
# TRANSFER_NAMES = []
# SRC_TASKS = []
G = [4]
TRANSFER_VALS = []
TRANSFER_NAMES = {}
SRC_TASKS = set()
TARGET_ONLY_TASKS = {}
TARGETS = []

# def make_bip_call_interface(supervision_costs, dists_and_wins, unused, src_only_tasks, target_only_tasks, targets):
#     global G, TRANSFER_VALS, TRANSFER_NAMES, SRC_TASKS, TARGET_ONLY_TASKS, TARGETS
#     # global G, transfer_vals, transfer_names, src_tasks
#     # G = []
#     def call_taxonomy_api(change, noclear=False):
#         ''' Callback function to create viz tabs and register callbacks when 'Solve!' is clicked '''
#         global G, TRANSFER_VALS, TRANSFER_NAMES, SRC_TASKS, TARGET_ONLY_TASKS, TARGETS
#         dists, dists_for_task, dists_for_pix, wins_v_task, wins_v_pixels = get_dists_for_options(
#             dists_and_wins, supervision_costs, DEFAULTS
#         )
#         dists_to_use = {'Affinity': dists, 'Quality v Task': dists_for_task, 'Quality v Pixels': dists_for_pix}
#         dists_to_use = dists_to_use[OPTIMIZER_TAB_INTERFACE.value]
#         res = solve_BIP(unused, src_only_tasks, target_only_tasks, targets, supervision_costs, dists_to_use)
#         total_affinity, sol, affinities, TRANSFER_NAMES, SRC_TASKS, TARGET_ONLY_TASKS = res
#         if sol.value is None:
#             raise ValueError("No solution found!")
        
#         G = make_graph(sol.value, affinities, TRANSFER_NAMES, SRC_TASKS + TARGET_ONLY_TASKS)
#         TRANSFER_VALS = create_cost_dict(affinities, dists, wins_v_task, wins_v_pixels, TRANSFER_NAMES, SRC_TASKS, targets)
#         # print(TRANSFER_VALS)
#         display("Goodness: {:.2f}".format(total_affinity))

#     def display_graph(_):
#         ''' Callback function to display graph when the tabs change '''
#         clear_output()
#         display(plot_msa(G, TRANSFER_VALS, TRANSFER_NAMES, SRC_TASKS + TARGET_ONLY_TASKS, targets + TARGET_ONLY_TASKS,
#             color=VIZ_TAB_INTERFACE.value))

#     OPTIMIZER_BUTTON_INTERFACE.on_click(call_taxonomy_api)
#     OPTIMIZER_BUTTON_INTERFACE.on_click(lambda x: make_viz_interface(display_graph))
#     VIZ_TAB_INTERFACE.observe(display_graph)

#     if not SIMPLE_INTERFACE:
#         display(OPTIMIZER_TAB_INTERFACE)
#     display(OPTIMIZER_BUTTON_INTERFACE)
#     # make_viz_interface(display_graph)
#     call_taxonomy_api(None)
#     display(VIZ_TAB_INTERFACE)
#     display_graph(None)
#     return OPTIMIZER_BUTTON_INTERFACE

# def make_viz_interface(display_graph):
#     clear_output()
#     display_graph(None)

# def make_supervision_params_accordion(all_tasks, unused, src_only_tasks):
#     # Set full supervision cost
#     supervision_accordion = widgets.Accordion(
#         children=
#             [widgets.FloatText(
#                 value=DEFAULTS['DEFAULT_FULL_SUPERVISION_COST'],
#                 description='Cost of full training:',
#                 disabled=False
#             ) for v in all_tasks])
#     for i, v in enumerate(all_tasks):
#         supervision_accordion.set_title(i, map_to_display_names[v])

#     # Set transfer supervision cost
#     transfer_accordion = widgets.Accordion(
#         children=
#             [widgets.FloatText(
#                 value=DEFAULTS['DEFAULT_TRANSFER_SUPERVISION_COST'],
#                 description='Cost of transfer:',
#                 disabled=False #(v in unused or v in src_only_tasks)
#             ) for v in all_tasks])
#     for i, v in enumerate(all_tasks):
#         transfer_accordion.set_title(i, map_to_display_names[v])

#     # Nest the supervision costs
#     tab_nest = widgets.Tab()
#     tab_nest.children = [supervision_accordion, transfer_accordion]
#     tab_nest.set_title(0, 'Cost of supervision')
#     tab_nest.set_title(1, 'Cost of transfer')

#     # Set supervision budget
#     supervision_budget_accordion = widgets.FloatText(
#             value=DEFAULTS['DEFAULT_SUPERVISION_BUDGET'],
#             description='Supervision budget:',
#             disabled=False)

#     # Set supervision budget
#     max_order_accordion = widgets.FloatText(
#             value=DEFAULTS['DEFAULT_MAX_ORDER'],
#             description='Max number of inputs:',
#             disabled=False)

#     # Set the relative value of each task
#     value_accordion = widgets.Accordion(
#         children=
#             [widgets.FloatText(
#                 value=DEFAULTS['DEFAULT_TASK_VALUE'],
#                 description='Relative value:',
#                 disabled=False
#             ) for v in all_tasks])
#     for i, v in enumerate(all_tasks):
#         value_accordion.set_title(i, map_to_display_names[v])

#     transfer_data_amount_slider = widgets.IntRangeSlider(
#         value=[
#             max(DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']),
#             max(DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS'])],
#         min=min(DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']),
#         max=max(DEFAULTS['TRANSFER_SUPERVISION_AMOUNTS']),
#         step=1,
#         description='Data size (in thousands):',
#         disabled=False,
#         continuous_update=True,
#         orientation='horizontal',
#         readout=True,
#         readout_format='d',
#     )
    
#     supervision_costs = widgets.Accordion(
#         children=(
#             tab_nest,
#             supervision_budget_accordion,
#             max_order_accordion,
#             value_accordion,
#             transfer_data_amount_slider
#         )
#     )
#     supervision_costs.set_title(0, "Cost of supervision")
#     supervision_costs.set_title(1, "Supervision budget")
#     supervision_costs.set_title(2, "Max-order transfer")
#     supervision_costs.set_title(3, "Relative task value")
#     supervision_costs.set_title(4, "Transfer Data Sizes")
    
#     supervision_costs.selected_index = 1
#     display(supervision_costs)
#     return supervision_costs



def make_graph(graph_vector, costs, transfer_names, node_list, priorities):
    # Makes a graph given a list of edges (possibly higher-order)
    g = nx.DiGraph()
    costs = np.squeeze(costs)
    node_list_raw = [n for n in node_list]
    node_list = [map_to_display_names[n] for n in node_list]

    node_to_color = {n: groupcolor(i) for i, n in enumerate(node_list)}

    used_transfers = {}
    for i, transfer in enumerate(transfer_names):
        tasks = transfer.split("__")
        srcs, dst = tasks[:-1], tasks[-1]
        if graph_vector[i] < 0.99: # this edge is not selected
            continue
        print(dst)
        used_transfers[dst] = transfer
        for src in srcs:
            # g.add_edge(src, dst, {'weight': float(costs[i]), 'edge_idx': i})
            g_s = map_to_display_names[src]
            g_t = map_to_display_names[dst]
            g_t = map_to_display_names[dst]
            g.add_edge(g_s, g_t, {'weight': float(costs[i]), 'edge_idx': i})
            g.edge[g_s][g_t]['viz'] = {'color': node_to_color[g_s]}

    for i, n in enumerate(node_list):
        # n = map_to_display_names[n]
        g.add_node(n)
        g.node[n]['viz'] = {'color': groupcolor(i)}
        g.node[n]['viz']['label'] = n
        # g.node[n]['viz']['label']['color'] = groupcolor(i)
        g.node[n]['viz']['size'] = 100.
        in_edges = g.in_edges([n])
        if len(in_edges) == 0: # Root node
            g.node[n]['weight'] = float(costs[i + len(transfer_names)])
            g.node[n]['transfer_name'] = node_list_raw[i]
        else:
            g.node[n]['weight'] = max([g[s][n]['weight'] for s, _ in in_edges])
            g.node[n]['transfer_name'] = used_transfers[node_list_raw[i]]

    for s,t in g.edges():
        # print(s,t, g[s][t]['weight'])
        g[s][t]['weight'] = 1.0
        g[s][t]['priority'] = priorities[t][s]
    # g.add_node('.')
    # g.node['.']['viz'] = {'color': groupcolor(i)}
    # g.node['.']['viz']['label'] = '.'
    # # g.node[n]['viz']['label']['color'] = groupcolor(i)
    # g.node['.']['viz']['size'] = 1.
    # g.add_edge('.','.', {'weight': 1.})
    return g

def hex2rgb(h):
    return tuple(int(h[i:i+2], 16) for i in (0, 2 ,4))

def groupcolor(i):
    colors = [
    '1f77b4', 'aec7e8',
    'ff7f0e', 'ffbb78',
    '2ca02c', '98df8a',
    'd62728', 'ff9896',
    '9467bd', 'c5b0d5',
    '8c564b', 'c49c94',
    'e377c2', 'f7b6d2',
    '7f7f7f', 'c7c7c7',
    'bcbd22', 'dbdb8d',
    '17becf', '9edae5'
    ]
    r,g,b = hex2rgb(colors[i % len(colors)])
    return {'r': r, 'g': g, 'b': b}

def create_cost_dict(costs, dists, win_v_task, win_v_pix, transfer_names, node_list, target_tasks):
    costs = np.squeeze(costs)
    affinities = np.zeros_like(costs)
    win_v_task_as_vec = np.zeros_like(costs)
    win_v_pix_as_vec = np.zeros_like(costs)
    for i, transfer in enumerate(transfer_names):
        affinities[i] = dists[transfer]
        win_v_task_as_vec[i] = win_v_task[transfer]
        win_v_pix_as_vec[i] = win_v_pix[transfer]
    for i, n in enumerate(node_list):
        if n not in target_tasks:
            continue
        affinities[i + len(transfer_names)] = dists["self__" + n]
        win_v_task_as_vec[i + len(transfer_names)] = win_v_task["self__" + n]
        win_v_pix_as_vec[i + len(transfer_names)] = win_v_pix["self__" + n]
    return {
        'affinity': affinities,
        'win_v_task': win_v_task_as_vec,
        'win_v_pix': win_v_pix_as_vec
    }
    
def write_node_weights(g, costs, transfer_names, node_list, prop='weight'):
    for i, n in enumerate(node_list):
        n = map_to_display_names[n]
        in_edges = g.in_edges([n])
        if len(in_edges) == 0: # Root node
            g.node[n][prop] = costs[i + len(transfer_names)]
        else:
            g.node[n][prop] = max([costs[g[s][n]['edge_idx']] for s, _ in in_edges])
    return g

def plot_msa(h, transfer_vals, transfer_names, present_tasks, target_tasks, color='Quality'):
    if color == 'Affinity':
        g = write_node_weights(h, transfer_vals['affinity'], transfer_names, present_tasks)
    elif color == 'Quality v Task':
        g = write_node_weights(h, transfer_vals['win_v_task'], transfer_names, present_tasks)
    elif color == 'Quality v Pixels':
        g = write_node_weights(h, transfer_vals['win_v_pix'], transfer_names, present_tasks)
    elif color == 'Groups':
        g = write_node_weights(h, transfer_vals['affinity'], transfer_names, present_tasks)
    else:
        raise NotImplementedError("Unknown color {}".format(color))
    g = write_node_weights(h, transfer_vals['affinity'], transfer_names, present_tasks, 'affinity')
    g = write_node_weights(h, transfer_vals['win_v_task'], transfer_names, present_tasks, 'quality')
    g = write_node_weights(h, transfer_vals['win_v_pix'], transfer_names, present_tasks, 'gain')

    print(color, sum([g.node[n]['weight'] for n in g.node]))

    if color == 'Groups':
        color = 'group'
    elif color == 'Affinity':
        color = 'affinity'
    else:
        color = 'weight'

    node_list = g.nodes()
    names_to_idx = {v: k for k, v in enumerate(node_list)}
    mapped_targets = set([map_to_display_names[v] for v in target_tasks])
    # write_node_weights

    def getName(node, g):
        if node in mapped_targets:
            return node + ' ({:.2f})'.format(g.node[node]['weight'])
        else:
            return node

    _graph = {
        "nodes": [ 
            {
                'name': getName(node, g), 
                "group": i, 
                "text_size": "15px" if node in mapped_targets else "12px", 
                "r": 20 if node in mapped_targets else 5,
                "nweight": g.node[node]['weight'],
                "affinity": g.node[node]['affinity'],
                # "group": g.node[node]['affinity'],
                "quality": g.node[node]['quality'],
                "gain": g.node[node]['gain'],
                "color_by": color, # group
                "in_targets": "true" if node in mapped_targets else "false"
            }
            for i, node in enumerate(node_list) 
        ], 
        "links": [ 
            { 
                'source': names_to_idx[s],       
                'target': names_to_idx[t], 
                'value': g[s][t]['weight']
            } 
            for s, t in g.edges()
        ]
    }
    # visualize as force-directed graph in D3
    # return HTML( 
    return '<script src="viz/js/d3.js"></script>' + \
        d3_lib.set_styles(['force_directed_graph']) + \
        d3_lib.draw_graph('force_directed_graph',
            {
                'data': _graph,
                'color_by_scheme': "\"" + color + "\""
            }

        # )
    )


def get_graph(h, transfer_vals, transfer_names, present_tasks, target_tasks, color='Quality'):
    if color == 'Affinity':
        g = write_node_weights(h, transfer_vals['affinity'], transfer_names, present_tasks)
    elif color == 'Quality v Task':
        g = write_node_weights(h, transfer_vals['win_v_task'], transfer_names, present_tasks)
    elif color == 'Quality v Pixels':
        g = write_node_weights(h, transfer_vals['win_v_pix'], transfer_names, present_tasks)
    elif color == 'Groups':
        g = write_node_weights(h, transfer_vals['affinity'], transfer_names, present_tasks)
    else:
        raise NotImplementedError("Unknown color {}".format(color))
    
    g = write_node_weights(h, transfer_vals['affinity'], transfer_names, present_tasks, 'affinity')
    g = write_node_weights(h, transfer_vals['win_v_task'], transfer_names, present_tasks, 'quality')
    g = write_node_weights(h, transfer_vals['win_v_pix'], transfer_names, present_tasks, 'gain')

    print(color, sum([g.node[n]['weight'] for n in g.node]))

    if color == 'Groups':
        color = 'group'
    elif color == 'Affinity':
        color = 'affinity'
    else:
        color = 'weight'

    node_list = g.nodes()
    names_to_idx = {v: k for k, v in enumerate(node_list)}
    mapped_targets = set([map_to_display_names[v] for v in target_tasks])
    # write_node_weights
    def getName(node, g):
        if node in mapped_targets:
            return node + ' ({:.2f})'.format(g.node[node]['weight'])
        else:
            return node

    _graph = {
        "nodes": [ 
            {
                'name': node, 
                "group": i, 
                "text_size": "15px" if node in mapped_targets else "12px", 
                "r": 20 if node in mapped_targets else 5,
                "nweight": g.node[node]['weight'],
                "affinity": g.node[node]['affinity'],
                # "group": g.node[node]['affinity'],
                "quality": g.node[node]['quality'],
                "gain": g.node[node]['gain'],
                "color_by": color, # group
                "transfer_name": map_to_video_name(g.node[node]['transfer_name'], method=None), # group
                "alex_name": map_to_video_name(g.node[node]['transfer_name'], method="alex"), # group
                "scratch_name": map_to_video_name(g.node[node]['transfer_name'], method="scratch"), # group
                "in_targets": "true" if node in mapped_targets else "false",
                "is_transfer": "true" if is_transfer(g.node[node]['transfer_name']) else "false",

            }
            for i, node in enumerate(node_list) 
        ], 
        "links": [ 
            { 
                'source': names_to_idx[s],       
                'target': names_to_idx[t], 
                'value': g[s][t]['weight'],
                'priority': g[s][t]['priority']
            } 
            for s, t in g.edges()
        ]
    }
    # visualize as force-directed graph in D3
    return {
                'data': _graph,
                'color_by_scheme': color
            }


def map_to_video_name(transfer_name, method=None):
    tasks = transfer_name.split("__")

    srcs, dst = tasks[:-1], tasks[-1]
    if dst not in ['class_places', 'class_1000', 'autoencoder', 'curvature', 
        'denoise', 'edge2d', 'edge3d', 'keypoint2d', 'keypoint3d', 'reshade', 
        'rgb2depth', 'rgb2mist', 'rgb2sfnorm', 'segment25d', 'segment2d', 
        'segmentsemantic_rb', 'vanishing_point_well_defined', 'room_layout', 
        'impainting']:
        return "NONE"
    if len(srcs) == 0:
        if method == 'scratch':
            method = 'pixels'
        if method is None:
           return "{}/{}".format(dst, dst +"_4.webm")
        else:
           return "{}/{}".format(dst, method + "__" + dst + "__8__unlocked_4.webm")
    if len(srcs) > 4:
        transfer_name_in_vid = str(len(srcs))
    elif len(srcs) == 1:
        transfer_name_in_vid = srcs[0]
    else:
        transfer_name_in_vid = srcs[0] + "__" + ",".join(srcs[1:])
    if method == "alex":
        transfer_name_in_vid = "alex"
    if method == "scratch":
        transfer_name_in_vid = "pixels"
    return "{}/{}".format(dst, transfer_name_in_vid + "__" + dst + "__8__unlocked_4.webm")

def is_transfer(transfer_name):
    tasks = transfer_name.split("__")
    srcs, dst = tasks[:-1], tasks[-1]
    if dst not in ['class_places', 'class_1000', 'autoencoder', 'curvature', 
        'denoise', 'edge2d', 'edge3d', 'keypoint2d', 'keypoint3d', 'reshade', 
        'rgb2depth', 'rgb2mist', 'rgb2sfnorm', 'segment25d', 'segment2d', 
        'segmentsemantic_rb', 'vanishing_point_well_defined', 'room_layout', 
        'impainting']:
        return "NONE"
    return len(srcs) != 0
