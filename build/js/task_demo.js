(function($) {
    "use strict"
    var map_to_display_names = {
        'autoencoder': 'Autoencoding',
        'curvature': '3D Curvature',
        'class_places': 'Scene Classification',
        'denoise': 'Denoising Autoencoding',
        'edge2d': '2D Texture Edges',
        'edge3d': '3D Occlusion Edges',
        'ego_motion': 'Triplet Camera Pose',
        'fix_pose': 'Pairwise Fixated Camera Pose',
        'keypoint2d': '2D Keypoints',
        'keypoint3d': '3D Keypoints',
        'non_fixated_pose': 'Pairwise Non-fixated Camera Pose',
        'point_match': 'Point Matching',
        'reshade': 'Image Reshading',
        'rgb2depth': 'Z-buffer Depth',
        'rgb2mist': 'Euclidean Distance',
        'rgb2sfnorm': 'Surface Normals',
        'room_layout': 'Room Layout',
        'segment25d': 'Unsupervised 2.5D Segm.',
        'segment2d': 'Unsupervised 2D Segm.',
        'vanishing_point_well_defined': 'Vanishing Points',
        'segmentsemantic_rb': 'Semantic Segmentation',
        'class_selected': 'Object Classification (100)',
        'class_1000': 'Object Classification',
        'random': 'Random Projection Feature',
        'self': 'Task-Specific',
        'pixels': 'Only Image',
        'impainting_whole': 'Image In-painting',
        'colorization': 'Colorization',
        'jigsaw': 'Jigsaw Puzzle', 
    }
    var display_names_to_task = []; // or var revMap = {};
    Object.keys(map_to_display_names).forEach(function(key) { 
        display_names_to_task[map_to_display_names[key]] = key;   
    });

    var VALID_TARGETS = [];
    // [
    //     'Autoencoding', 'Curvature', 'Scene Class.', 'Denoising', '2D Edges', 'Occlusion Edges',
    //     '2D Keypoints', '3D Keypoints', 'Reshading', 'Z-Depth', 'Distance', 'Normals', 'Layout',
    //     '2.5D Segm.', '2D Segm.', 'Vanishing Pts.', 'Semantic Segm.',  'Object Class. (1000)', 
    //     'Colorization', 'Jigsaw', 'In-painting'
    // ]
    var sortOrder = [
        'rgb2sfnorm',
        'reshade',
        'rgb2depth'
        ];

    for (var i in sortOrder){
        VALID_TARGETS.push(map_to_display_names[sortOrder[i]]);
    }

    var getToken = function() {
        return "aa" + Math.random().toString(36).substr(2); // remove `0.`
    };

    document.getElementById("uploadToken").value = getToken();

    var source_exists = false;
    var all_videos = [];

    var clearDemo = function(){
        document.getElementById("output-section").innerHTML = "";        
        // document.getElementById("our-vids").innerHTML = "";
        // document.getElementById("alex-vids").innerHTML = "";
        // document.getElementById("scratch-vids").innerHTML = "";
        all_videos = [];
        source_exists = false;
    };
    $('#clearDemo').on("click", clearDemo);


    var loaderHTML = `
    <div class="spinner"></div>`;

    var makeImageFrame = function(title, ensureSameSize) {
        var imageHolder = document.createElement("div");
        imageHolder.classList.add('col-xs-12');
        imageHolder.classList.add('col-sm-6');
        imageHolder.classList.add('col-lg-4');
        // imageHolder.classList.add('col-xs-' + cols.toString());
        imageHolder.classList.add('no-pad');
        imageHolder.classList.add('image-holder');

        
        var titleElem = document.createElement("div");
        titleElem.innerHTML = "<h4 style='word-wrap: break-word;padding-bottom: 5px;margin-bottom: 0px'>" + title + "</h4>";

        var loader = document.createElement("div");
        loader.innerHTML = loaderHTML;

        if (ensureSameSize) {
            titleElem.classList.add('returnedImageTitle');
            imageHolder.classList.add('returnedImage');
        }
        
        imageHolder.appendChild(titleElem);
        imageHolder.appendChild(loader);
        return [imageHolder];
    }


    var ensureSameSize = function(className){
        var boxes = $('.' + className);
        var maxHeight = Math.max.apply(
          Math, boxes.map(function() {
            return $(this).outerHeight();
        }).get());
        // boxes.height(maxHeight);
        boxes.css('height', maxHeight);        
        return maxHeight;
    };

    var resizeMinHeight = function(className) {
        var boxes = $('.' + className);
        boxes.css('height', "");        
        ensureSameSize(className);
    }

    var updateImageFrame = function(imageHolder, image_uri, crop) {    
        imageHolder.children[1].remove();
        var containerDiv = document.createElement("div");
        if (crop) {
            containerDiv.className = 'thumbnail2';
        }

        var oImg = document.createElement("img");
        oImg.setAttribute('alt', 'na');
        if (!crop){
            oImg.setAttribute('height', '100%');
            oImg.setAttribute('width', '100%')
            oImg.onload = function() {
                ensureSameSize('returnedImageTitle');
                resizeMinHeight('returnedImage');
            }

        }
        else {
            oImg.onload = function() {
                oImg.className = oImg.width > oImg.height ? '' : 'portrait';                
            }
        }
        oImg.setAttribute('crossorigin', "anonymous");
        oImg.setAttribute('src', image_uri);        
        containerDiv.appendChild(oImg);
        imageHolder.appendChild(containerDiv);
        return [imageHolder, oImg];
    }

    var loadFile = function(event) {
        var fileSizeInMB = $('#imageUploadInput')[0].files[0].size/1024/1024;
        if (fileSizeInMB > 8.4) {
            alert('Please ensure upload is < 8MB. The current image size is: ' + fileSizeInMB.toFixed(2) + "MB.");
            document.getElementById("imageUploadInput").value = '';
            return;
        }

        document.getElementById("uploadToken").value = getToken();
        var image_uri = URL.createObjectURL(event.target.files[0])
        showSourceImage(image_uri);
    };

    var showSourceImage = function(image_uri) {
        clearDemo();
        document.getElementById("source-section").innerHTML = ""; 
        var imFrame = makeImageFrame("Input Image", false);        
        imFrame = updateImageFrame(imFrame[0], image_uri, true);        
        imFrame[0].classList.remove('col-sm-6');
        imFrame[0].classList.remove('col-med-6');
        imFrame[0].classList.remove('col-lg-4');
        document.getElementById("source-section").setAttribute("data-spy", "affix");
        document.getElementById("source-section").setAttribute("data-offset-top", "01");
        document.getElementById("source-section").appendChild(imFrame[0]);
    }

    $('#imageUploadInput').on("change", loadFile);


    $('#formResponse').on("change", function(event){
        console.log(event);
    });

    
    var setIntervalWithMaxAttempts = function(callback, interval, maxAttempts) {
        var intervalId = null;
        var counter = 0;
        var wrappedCallback = function(){
            if (maxAttempts != null && counter < maxAttempts) {
                clearInterval(intervalId);
                return;
            }
            counter += 1;
            callback();
        }

        intervalId = setInterval(callback, 1000);        
    };


    var intervals = []
    var num_on_row = 0;
    var getResponseURLs = function(uploadtoken, task, callback){    
        
        var imFrame = makeImageFrame(task, true);
        document.getElementById("output-section").appendChild(imFrame[0]);
        
        num_on_row += 1;
        // if (num_on_row * 4 >= 12) {
        //     num_on_row = 0;
        //     var newRow = document.createElement("div");
        //     newRow.className = 'row';
        //     document.getElementById("output-section").appendChild(newRow);
        // }

        var checkTaskIntervalId = null;        
        var checkTaskCounter = 0;
        var maxCheckTaskAttempts = 60
        var checkTask = function(){
            if (checkTaskCounter >= maxCheckTaskAttempts) {
                clearInterval(checkTaskIntervalId);
                return;
            }
            checkTaskCounter += 1;

            // Code to execute
            var xhr = new XMLHttpRequest();
        
            var imageUri = encodeURI(
                "https://storage.googleapis/task-demo-results/predictions/" + uploadtoken + "__" + display_names_to_task[task] + ".png");

           
            //xhr.onload = function () {
            //    // Request finished. Do processing here.
            //    var rawResponse = xhr.responseText; // truncated for example
    
            //     // convert to Base64
            //     var b64Response = btoa(unescape(encodeURIComponent(rawResponse)));
                
            //     // create an image
            //      outputImg.src = 'data:image/png;base64,'+b64Response;
                
            //     // append it to your page
            //     document.body.appendChild(outputImg);
            //     console.log(imageUri);
            //     callback(task, imFrame, imageUri);   
            //     console.log("response", xhr.responseText);         
            //     clearInterval(checkTaskIntervalId);                
            // };
            
            xhr.ontimeout = function (e) {
                    console.log(task + ' stalled');
            };

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4 && xhr.status == 200) {
                    // console.log(imageUri);
                    callback(task, imFrame, imageUri);   
                    // console.log("response", xhr.responseText);  
                    clearInterval(checkTaskIntervalId);
                    intervals.pop(intervals.indexOf(checkTaskIntervalId), 1); //Remove
                } 
                else {
                    // console.log("404:", checkTaskCounter,  Date.now());                    
                }
            };
            xhr.open(
                'HEAD', 
                encodeURI(
                    "https://storage.googleapis/task-demo-results/predictions/" + uploadtoken + "__" + display_names_to_task[task] + ".png"),
                true);
            xhr.timeout = 3000;
            xhr.send();

          
        };
        console.log(encodeURI(
            "https///storage.googleapis/task-demo-results/predictions/" + uploadtoken + "__" + display_names_to_task[task] + ".png"));
        // checkTask();
        checkTaskIntervalId = setInterval(checkTask, 3000);
        intervals.push(checkTaskIntervalId);
            // xhr.onreadystatechange = function()
            // {
            //     if(xhr.readyState == 4 && xhr.status == 200) {
            //         callback(task, imFrame, xhr.responseText);
            //     } else {
            //         console.log(task + ' failed');
            //     }
            // }
            // xhr.send(null);
    };


    var formValid = function() {
        var imageUploadInput = document.getElementById("imageUploadInput");
        var uploadToken = document.getElementById("uploadToken").value;
        var isSample = false;
        $(".sample-img").each(function() { 
            if (this.id == uploadToken) {
                isSample = true;
            }
            else {
                console.log(this.id, uploadToken);
            }
        } );
        console.log((isSample || imageUploadInput.value != "") && grecaptcha.getResponse().length > 0    );
        return (isSample || imageUploadInput.value != "") && grecaptcha.getResponse().length > 0

    };

    $('#submitDemo').on("click",function() {
        if (!formValid()){
            return;
        }
        document.getElementById("output-section").innerHTML = ""; 
        var uploadtoken = document.getElementById("uploadToken").value;
        // var selectedTasks = $("#targetpicker").val()

        for (var t in VALID_TARGETS) {
            var task = VALID_TARGETS[t];
            // Make the api call here...
            getResponseURLs(uploadtoken, task, function(taskname, imFrame, image_uri){
                // var imFrame = makeImageFrame(taskname, 4);
                imFrame = updateImageFrame(imFrame[0], image_uri, false);
            });
            // break;
        }
    });

    $('#uploadForm').on("submit",function() {
        if (!formValid()){
            return;
        }
        document.getElementById("imageUploadInput").style = "display:none";;        
        document.getElementById("imageUploadInputLabel").style = "display:none";;        
        
      
        document.getElementById("submitDemo").disabled=true;
        document.getElementById("submitDemo").value="refresh to upload new image";
    });
    

    $('.sample-img').each(function() {
        $( this ).on("click", function() {
            document.getElementById("uploadToken").value = this.id;
            $('.sample-img').each(function() {
                if (this.id == document.getElementById("uploadToken").value) {
                    this.classList.add('selected');
                }
                else {
                    this.classList.remove('selected');
                }
            });
            showSourceImage(this.src);


            var uploadtoken = document.getElementById("uploadToken").value;
            
            for (var t in VALID_TARGETS) {
                var task = VALID_TARGETS[t];
                // Make the api call here...
                getResponseURLs(uploadtoken, task, function(taskname, imFrame, image_uri){
                    // var imFrame = makeImageFrame(taskname, 4);
                    imFrame = updateImageFrame(imFrame[0], image_uri, false);
                });
                // break;
            }
        });
    });

    $( document ).ready (
        function () {
            $('#sample4').click();

            ensureSameSize('returnedImageTitle');
            $( window ).resize(function() {
                resizeMinHeight('returnedImageTitle');
                resizeMinHeight('returnedImage');
            });
        }
    );
})(jQuery);

