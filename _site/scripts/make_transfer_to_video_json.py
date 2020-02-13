
from   collections import defaultdict
import json
import pickle as pkl

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

print([t for t in k.keys() if 'self' in t])


def map_to_video_name(transfer_name, method=None):
    tasks = transfer_name.split("__")
    srcs, dst = tasks[:-1], tasks[-1]
    if dst not in ['class_places', 'class_1000', 'autoencoder', 'curvature', 'denoise', 'edge2d', 'edge3d', 'keypoint2d', 'keypoint3d', 'reshade', 'rgb2depth', 'rgb2mist', 'rgb2sfnorm', 'segment25d', 'segment2d', 'segmentsemantic_rb']:
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

with open("../assets/all_affinities_16k.pkl", "rb") as f:
    transfers = pkl.load(f)

transfer_to_video = defaultdict(dict)

for transfer_name in transfers.keys():
    tasks = transfer_name.split("__")
    srcs, dst = tasks[:-1], tasks[-1]
    srcs = "/".join(sorted([map_to_display_names[s] for s in srcs]))
    transfer_to_video[map_to_display_names[dst]][srcs] = {}
    vid_names = transfer_to_video[map_to_display_names[dst]][srcs]
    vid_names['ours'] = map_to_video_name(transfer_name)
    vid_names['alex'] = map_to_video_name(transfer_name, 'alex')
    vid_names['scratch'] = map_to_video_name(transfer_name, 'scratch')

transfer_to_video

with open("../assets/transfers_to_videos.json", 'w') as f:
    json.dump(transfer_to_video, f)