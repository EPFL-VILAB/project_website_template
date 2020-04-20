from   flask import Flask, request, current_app, send_from_directory
from   flask.ext.cors import CORS, cross_origin
from   flask.ext.hashing import Hashing # pip install Flask-Hashing

from flask import Flask, render_template, request
from flask.ext.uploads import UploadSet, configure_uploads, IMAGES # pip install Flask-Uploads

# from   flask.ext.API import status
import json
import os
from   PIL import Image
from   shutil import copyfile
import time
import traceback
from   subprocess import call
import traceback as tb 

import requests
import boto3
import botocore

s3 = boto3.resource('s3')


app = Flask(__name__, static_url_path='', static_folder="/")
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOADED_PHOTOS_DEST'] = '/tmp/'
app.config['INPUT_PHOTOS_DEST'] = '/home/ubuntu/s3/demo_images'
app.config['PROCESSED_PHOTOS_DEST'] = 'task-demo-results'
app.config['PROCESSING_SCRIPT_LOCATION'] = '/home/ubuntu/task-taxonomy-331b/tools/run_img_task.py'
# PROCESSOR_SERVER = 'localhost' #'taskonomy-task-demo-797030650.us-west-2.elb.amazonaws.com'
PROCESSOR_SERVER = 'taskonomy-task-demo-797030650.us-west-2.elb.amazonaws.com'
VALID_UPLOADTOKEN_PREFIX = "aa"

UPLOAD_TOKENS_FOR_SAMPLES = ['sample1', 'sample2', 'sample3']

cors = CORS(app, resources={
    r"/runmodels": {"origins": "*"},
    r"/getresults": {"origins": "*"},
})
hashing = Hashing(app)
photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)

salt = "jitendra"

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

display_name_to_task = {v: k for k, v in map_to_display_names.items()}
list_of_tasks = 'autoencoder curvature denoise edge2d edge3d \
keypoint2d keypoint3d colorization jigsaw \
reshade rgb2depth rgb2mist rgb2sfnorm \
room_layout segment25d segment2d vanishing_point_well_defined \
segmentsemantic_rb class_1000 class_places impainting_whole'
list_of_tasks = list_of_tasks.split()

ports = [ 8080 + i for i in range(len(list_of_tasks))]
task_to_port = {task: port for task, port in zip(list_of_tasks, ports)}
print(task_to_port)

def touch(fname, times=None):
    with open(fname, 'a'):
        os.utime(fname, times)

def clean_task_name(task):
    task = task.replace("(","")
    task = task.replace(")","")
    task = task.replace(".","")
    task = task.replace(" ","_")
    return task


def convert_to_png(src, dst):
    ''' Convert all images to PNG to save us a headache '''
    _, ext = os.path.splitext(src)
    dst = src.replace(ext, ".png")
    if src == dst:
        return src
    call("convert {} {} && rm {}".format(src, dst, src), shell=True)
    return dst

def fix_orientation(filename):
    ''' iOS devices might save images as portraits. This is handled
      by parsing EXIF data. However, python libraries often do not 
      implement EXIF handling. Therefore, we may rotate/flip the image
      as appropriate here, before saving, to spare us from the headache.

      Warnings: Mutates saved image on disk

      Inputs:
        filename: path to the saved image 
    '''
    img = Image.open(filename)
    if hasattr(img, '_getexif'):
        exifdata = img._getexif()
        try:
            orientation = exifdata.get(274)
            print("ORIENTATION", orientation)
        except:
            # There was no EXIF Orientation Data
            orientation = 1
    else:
        orientation = 1

    if orientation is 1:    # Horizontal (normal)
        pass
    elif orientation is 2:  # Mirrored horizontal
        img = img.transpose(Image.FLIP_LEFT_RIGHT)
    elif orientation is 3:  # Rotated 180
        img = img.rotate(180)
    elif orientation is 4:  # Mirrored vertical
        img = img.rotate(180).transpose(Image.FLIP_LEFT_RIGHT)
    elif orientation is 5:  # Mirrored horizontal then rotated 90 CCW
        img = img.rotate(-90).transpose(Image.FLIP_LEFT_RIGHT)
    elif orientation is 6:  # Rotated 90 CCW
        img = img.rotate(-90)
    elif orientation is 7:  # Mirrored horizontal then rotated 90 CW
        img = img.rotate(90).transpose(Image.FLIP_LEFT_RIGHT)
    elif orientation is 8:  # Rotated 90 CW
        img = img.rotate(90)

    img.save(filename)

def process_input_file(raw_file_name, task):
    print("Requesting:", raw_file_name, task)
    # dir_for_token = uploadDirForToken(request.args['uploadtoken'])
    # fname = secureFileName(request.args['uploadtoken'], "__") + display_name_to_task[request.args['task']] + ".png"
    try:
        print(task, task_to_port[display_name_to_task[task]])
        s3.Object(app.config['PROCESSED_PHOTOS_DEST'], raw_file_name.replace(".png", "__" + display_name_to_task[task] + ".png")).delete()
        r = requests.get(
            'http://{}:{}/process?key={}'.format(
                PROCESSOR_SERVER,
                task_to_port[display_name_to_task[task]],
                raw_file_name),
            timeout=0.000001
            )
    except:
        # tb.print_exc()
        pass
    # head, ext = os.path.splitext(filename)
    # ext = ".png"
    # # task = task.replace(" ", "_")
    # cleaned_task = clean_task_name(task)
    # # cmd = "sudo cp " + os.path.join(fpath, filename) + " " + os.path.join(fpath, task + ext)

    # tmpdir = '/tmp/' + unique_dir
    # call("mkdir " + tmpdir, shell=True)
    # src = convert_to_png(src)
    # call("sudo cp {} {}".format(
    #     src, 
    # ))
    # cmd = "python {} --task {} --img {} --store {}".format(
    #     app.config['PROCESSING_SCRIPT_LOCATION'],
    #     display_name_to_task[task],
    #     src,
    #     os.path.join(tmpdir, cleaned_task + ext)
    # )
    # call(cmd, shell=True)
    
    # call("sudo cp {} {} && rm {}".format(
    #     os.path.join(tmpdir, cleaned_task + ext),
    #     os.path.join(fpath, cleaned_task + ext),
    #     os.path.join(tmpdir, cleaned_task + ext)
    # ), shell=True)
    # # /home/ubuntu/anaconda3/bin/python /home/ubuntu/task-taxonomy-331b/tools/run_img_task.py --task reshade --img /home/ubuntu/s3/demo_images/92ba9602b8339d47df10be880c1d773a8e6b74465eb6a0bc5e7ec9391574aa64/download.png --store /home/ubuntu/s3/demo_images/92ba9602b8339d47df10be880c1d773a8e6b74465eb6a0bc5e7ec9391574aa64/2D_Edges.png

    # # call(cmd, shell=True)

def uploadDirForToken(uploadToken):
    return hashing.hash_value(uploadToken, salt=salt)

def secureFileName(uploadToken, ext):
    return uploadToken + ext
    # return hashing.hash_value(uploadToken, salt=salt)[:32] + ext


# TARGET_TASKS =  [
#         'Autoencoding', 'Curvature', 'Scene Class.', 'Denoising', '2D Edges', 'Occlusion Edges',
#         '2D Keypoints', '3D Keypoints', 'Reshading', 'Z-Depth', 'Distance', 'Normals', 'Layout',
#         '2.5D Segm.', '2D Segm.', 'Vanishing Pts.', 'Semantic Segm.',  'Object Class. (1000)', 
#         'Colorization', 'Jigsaw', 'In-painting'
#     ]

sortOrder = [
        'rgb2sfnorm',
        'reshade',
        'edge2d',
        'segmentsemantic_rb',
        'vanishing_point_well_defined',
        'segment25d',
        'rgb2depth',
        'room_layout',
        'class_places', 
        'keypoint3d',
        'edge3d',
        'autoencoder',
        'rgb2mist',
        'segment2d', 
        'curvature',
        'keypoint2d', 
        'class_1000',
        'denoise',
        'colorization',
        'impainting_whole'
        ];

TARGET_TASKS = [map_to_display_names[t] for t in sortOrder]
CAPTCHA_SECRET = "6Ler2EYUAAAAAI1hOvXBOpCUTwVZ6ZZ9y04P6YfY"
# CAPTCHA_SECRET = "6LebLEoUAAAAAPf5vmOe-QjzVhAx8U-Q16Ut488i"

def validate_captcha(request):
    print({
            "secret": CAPTCHA_SECRET,
            "response": request.form['g-recaptcha-response'],
            "remoteip": request.remote_addr
            })
    r = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={
            "secret": CAPTCHA_SECRET,
            "response": request.form['g-recaptcha-response'],
            "remoteip": request.remote_addr
            })

    return r.json()['success']

@app.route('/runmodels', methods=['GET', 'POST'])
def upload():
    try:
        if request.method == 'POST' and 'photo' in request.files:
            if not validate_captcha(request):
                return "Captcha failed", 403
            uploadToken = request.form['uploadToken']
            
            if uploadToken in UPLOAD_TOKENS_FOR_SAMPLES:
                print("in Sample")
                return 'sample', 200
            elif not uploadToken.startswith(VALID_UPLOADTOKEN_PREFIX):
                return 'Invalid upload token', 403

            rawFileName = secureFileName(uploadToken, '.png')
            filename = photos.save(request.files['photo'])

            #### HERE #####
            fix_orientation(os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename))

            cmd = "sudo convert {} {} && rm {}".format(
                    os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename),
                    os.path.join(app.config['INPUT_PHOTOS_DEST'], rawFileName),
                    os.path.join(app.config['UPLOADED_PHOTOS_DEST'], filename)),
            print(cmd)
            call(cmd, shell=True)

            for task in TARGET_TASKS:
                process_input_file(rawFileName, task)
            return filename, 200
        else:
            print("what")    # else:
            # for k, v in request.__dict__.items():
                # print k, v
        return "We're good.", 200
    except:
        traceback.print_exc()

def s3_file_exists(bucket, key):
    try:
        s3.Object(bucket, key).load()
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            return False
        else:
            # Something else has gone wrong.
            raise
    else:
        return True

@app.route('/getresults', methods=['GET'])
def get_results():
    try:
        validate_captcha(request)
        # print(request.args['uploadtoken'])
        # print(request.args['task'])
        dir_for_token = uploadDirForToken(request.args['uploadtoken'])
        fname = secureFileName(request.args['uploadtoken'], "__") + display_name_to_task[request.args['task']] + ".png"
        s3.Object(app.config['PROCESSED_PHOTOS_DEST'], fname).delete()

        # fname_url = subpath.replace(" ", "%20")
        # print(image_path)
        # try:
            # call("sudo rm {}".format(image_path), shell=True)
        # except:
            # tb.print_exc()
        for i in range(5 * 60 * 4):
            if s3_file_exists(app.config['PROCESSED_PHOTOS_DEST'], fname):
                return "//s3-us-west-2.amazonaws.com/task-demo-results/" + fname, 200
            # print("waiting", os.path.join(app.config['PROCESSED_PHOTOS_DEST'], fname))
            time.sleep(0.25)
        # This might not be a jpg
        return "//3d4igz27oxtl2iwox73y9smh-wpengine.netdna-ssl.com/media/wp-content/uploads/sites/3/2017/07/22-cool-cat-wearing-earphones-funny-kitten-fails.jpg", 500
    except:
        traceback.print_exc()
        return "Error", 500

@app.route('/results/<path:path>')
def send_js(path):
    print(path)
    return send_from_directory(app.config['PROCESSED_PHOTOS_DEST'] , path)

@app.route('/ping', methods=['GET'])
def ping():
    return "OK", 200, {'content-length':'2'} 

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=8886, threaded=True)

