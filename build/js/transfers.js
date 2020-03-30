(function($) {
    "use strict"
    // <option value="volvo">Volvo</option>

    var vidElementForTarget = function(target) {
        return target.replace(" ", "_").replace(".", ".");
    }

    var vidBaselineElementForTarget = function(target) {
        return target.replace(" ", "_").replace(".", "") + "Baseline";
    }

    var vidTitleElementForTarget = function(target) {
        return target.replace(" ", "_").replace(".", "") + "Title";
    }
    // Load all the transfers
    var transfers_to_videos = 0;
    var valid_targets = []


    // Create empty rows: 1 for each target
    var createVideoPlaceholders = function() {
        $("#video-section").empty();
        for (var i in valid_targets) {
            var target = valid_targets[i];

            var newRowTitle = document.createElement('div');
            newRowTitle.className = 'row';
            newRowTitle.id = vidTitleElementForTarget(target);
            document.getElementById("video-section").appendChild(newRowTitle);
            
            var newRowBaseline = document.createElement('div');
            newRowBaseline.className = 'row horiz-scroll';
            newRowBaseline.id = vidBaselineElementForTarget(target);
            document.getElementById("video-section").appendChild(newRowBaseline);

            var newRow = document.createElement('div');
            newRow.className = 'row horiz-scroll';
            newRow.id = vidElementForTarget(target);
            document.getElementById("video-section").appendChild(newRow);

            
        }
    }
    

    var transferToTitleElement = { };

    var getTransferTitleElement = function(transferName, counts) {
        var order = transferName.split(" + ").length;
        if (order < 2) {
            return transferName;
        }
        else {
            // console.log(transferName.replaceAll("/", " - "));
            var orderName = order.toString();
            if (order == 2) {
                orderName += "nd";
            }
            else if (order == 3) {
                orderName += "rd";
            }
            else {
                orderName += "th";
            }
            
            if (!(orderName in counts)) {
                counts[orderName] = 0;
            }
            counts[orderName] += 1;

            var counter = ""
            if (order < 5) { // only one transfer 5th order and above
                counter = "(#" + counts[orderName] + ") "
            }
            
            return orderName + " Order  " + counter + 
            `<i 
                class="fa fa-info-circle"
                style="float:right"
                data-toggle="tooltip"
                data-trigger="focus"
                data-container=""
                data-placement="auto right" 
                data-original-title="
                    <div style='font-family: Poppins, sans-serif'>` +
                    transferName.split(" + ").join("<br>") +
                    `</div>"
            >
            </i>`;
        }
    }

    var addSources = function() {
        var selected_target = $("#targetpicker").val();
        transfers_to_videos[selected_target]['ImageNet'] = {'ours': transfers_to_videos[selected_target]['Task-Specific']['alex']};
        transfers_to_videos[selected_target]['No Transfer'] = {'ours': transfers_to_videos[selected_target]['Task-Specific']['scratch']};
        // transfers_to_videos[selected_target]['Task-Specific']['scratch']);
        
        var sources_to_vids = transfers_to_videos[selected_target]
        var sources = Array.from(Object.keys(sources_to_vids));
        sources.sort(function(a, b){ // Single-source first
            var a_srcs = a.split("/")
            var b_srcs = b.split("/")
            if (a_srcs.length == b_srcs.length) {
                return a >= b ? 1 : -1
            }
            return a_srcs.length - b_srcs.length
        });
        var innerHTML = "";
        for (var i in sources) {
            var key = sources[i];
            innerHTML = innerHTML + '<option value="' + key + '">' + key.replace(/\//g, " + ") + 
            '' +
            '</option>\n';
            
        }
        $("#sourcepicker").html(innerHTML);
        $("#sourcepicker").selectpicker('refresh');


        var counts = {};
        $('[data-id="sourcepicker"]').parent().children('[role="combobox"]').find(".text").each( function () {
            transferToTitleElement[this.innerHTML] = getTransferTitleElement(this.innerHTML, counts);
            this.innerHTML = transferToTitleElement[this.innerHTML];
        });
        $("#sourcepicker").selectpicker('val', 'Curvature');

        // console.log("Updating " + selected_target);
        $('[data-id="sourcepicker"]').parent().addClass('sourcepickerclass');
        // $('[data-id="sourcepicker"]').parent().children('[role="combobox"]').addClass('sourcepickerclass');



    };


    var source_exists = [];
    var all_videos = [];
    var other_exists = [];

    $('#clearDemo').on("click", function() {
        document.getElementById("video-section").innerHTML = "";        
        // document.getElementById("our-vids").innerHTML = "";
        // document.getElementById("alex-vids").innerHTML = "";
        // document.getElementById("scratch-vids").innerHTML = "";
        all_videos = [];
        source_exists = [];
        other_exists = [];
        createVideoPlaceholders();
        //var bttn = document.getElementById("pauseDemo");
        //bttn.value = "Play";
    });


    var makeVideoFrame = function(title, vid_name) {
        var folderName = "video_short";
        // title = title.includes("To:") ? title : '← ' + transferToTitleElement[title];
        var videoHolder = document.createElement("div");
        videoHolder.classList.add('col-xs-3');
        //videoHolder.classList.add('no-pad');
        //videoHolder.classList.add('scrollable');

        //if (title=="Input video (<b><i>X</i><sub>1</sub> </b>)"){
        //videoHolder.setAttribute("data-spy", "affix");
        //videoHolder.setAttribute("data-offset-top", "01");
        //videoHolder.classList.add('affix-top');
        //videoHolder.setAttribute('class', 'affix');
        //}

        if (vid_name.includes('self__')){
            vid_name = vid_name.replace('self__', '').replace('__8__unlocked', '');
        }

      
        var titleElem = document.createElement("div");
        titleElem.innerHTML = "<p class='vidtitle'>" + title + "</p>";

        //alert(vid_name);
        var cls = "hi";
        var vid = document.createElement("div");


        if (vid_name=="empty"){
           vid.innerHTML = '<video width=300' +
            ' height=300' +
            ' style="background-color:#FAFAFA" ' +
            ' >' +
            
            //'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short/' + vid_name + '" type="video/webm">' +
            //'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short_mp4/' + vid_name.replace('webm', 'mp4') + '" type="video/mp4">' +
            '</video>';
           videoHolder.appendChild(titleElem);
           videoHolder.appendChild(vid);


           return [videoHolder, vid];
        
        }

        vid.innerHTML = '<video muted playsinline preload="metadata" width=100%' + 
            ' height=100%' + 
            ' style="background-color:#ddd" class=' + cls + 
            ' loop >' +
            '<source src="' + vid_name + '" type="video/mp4">' +
            //'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short/' + vid_name + '" type="video/webm">' +
            //'<source src="https://s3.us-west-2.amazonaws.com/task-preprocessing-512-oregon/video_short_mp4/' + vid_name.replace('webm', 'mp4') + '" type="video/mp4">' +
            'Video not found.</video>';

        
        if(vid.innerHTML.includes("og_")){
            vid.innerHTML = vid.innerHTML.replace('video_short_mp4', 'video_test')
            vid.innerHTML = vid.innerHTML.replace('video_short', 'video_test')
        }

   
        //if ( (title=="Input video (<b><i>X</i><sub>1</sub> </b>)") ) {
          
        //   videoHolder.classList.add('affix');
           //videoHolder.setAttribute('class', 'affix');
           // videoHolder.setAttribute('data-spy', 'affix');
           //videoHolder.setAttribute('data-offset-top', '50');
           //videoHolder.setAttribute('data-offset-bottom', '100');
           //videoHolder.setAttribute('id', 'source-section');
       //    videoHolder.setAttribute('style', 'z-index:1');
       //  }

        videoHolder.appendChild(titleElem);
        videoHolder.appendChild(vid);
       
        return [videoHolder, vid];
    }


    var makeRowTitle = function(title) {
        var folderName = title == "Source" ? 'video_short' : 'video_short';
        var videoHolder = document.createElement("div");
        videoHolder.classList.add('col-xs-12');
        // videoHolder.classList.add('no-pad');

        var bb = videoHolder.getBoundingClientRect();
        var width = bb.right - bb.left;


        // var titleElem = document.createElement("div");
        // videoHolder.innerHTML = "<h4 style='float:right; transform: translateX(-100%) rotate(-90deg) ;'>" + title + "</h4>";
        videoHolder.innerHTML = "<h3 style='text-align:center;    text-decoration: underline; '>" + title + "</h4>";

        // videoHolder.appendChild(titleElem);
        return videoHolder;
    }


    var replaceSourcpickerTitle = function() {
        var selected_source = $(".sourcepickerclass .filter-option");
        var amended_html = transferToTitleElement[selected_source.html()]
        selected_source.html(amended_html);
    }

    var syncAllVideos = function(all_videos){
        var d = new Date();
        var start_time =  d.getTime()
        var timeout_length = 10000; // in millis
        var is_vid_load_timeout = function(vids) {
            return (d.getTime() - start_time > timeout_length)
        }

        var is_all_loaded = function(vids) {
            var n_loaded = 0;
            vids.forEach( function(vid) {
                vid = vid.children[0];
                console.log(vid.readyState);
                if(vid.readyState === 4 || vid.readyState === 1) {
                    n_loaded += 1;
                }
            });
            console.log(n_loaded, vids.length)
            return (n_loaded == vids.length);
        };


        var play_all = function(vids) {

       

            vids.forEach( function(vid) {
                vid = vid.children[0];
                vid.play();
            });
            
        };                    


      
        // Pause all videos until loaded
        //var bttn = document.getElementById("pauseDemo");
        
                
        all_videos.forEach( function(vid) {
            vid = vid.children[0];
            vid.pause();
            vid.currentTime = 0;
            vid.onloadeddata = function() {
                // if(is_vid_load_timeout(all_videos)) {
                if(is_all_loaded(all_videos) && !is_vid_load_timeout(all_videos)) {
                     
                      play_all(all_videos);
                }
                else {
                      //vid.pause();
                }
            };
        
        //bttn.value = "Pause";
         
        });
        
        

        //alert("timeout");
        //setTimeout(function() { play_all(all_videos); }, timeout_length);
    }


    var play_all = function(vids) {



            vids.forEach( function(vid) {
                vid = vid.children[0];
                vid.play();
            });

        };


    var pause_all = function(vids) {



            vids.forEach( function(vid) {
                vid = vid.children[0];
                vid.pause();
            });

        };

    $('#pauseDemo').on("click",function() {

     //var bttn = document.getElementById("pauseDemo");
     if (all_videos[0].children[0].paused) { 
        play_all(all_videos);
        //bttn.value = "Pause";

     }

     else {
        pause_all(all_videos);
        //bttn.value = "Play";
     }

     //alert(all_videos[0].children[0].paused);
    });


    $('#submitDemo').on("click",function() {
        var selected_target = $("#targetpicker").val();
        var selected_source = $("#sourcepicker").val();
        var other_baselines = $("#otherpicker").val();
        


        if (selected_target==selected_source) {alert("The prediction task and consistency (perceptual) readout cannot be the same. Please choose a different combination."); return;}
        //alert(selected_target);
        //alert(selected_source);        
        //alert(transfers_to_videos);
        //alert(transfers_to_videos["Normals"]["Z-Depth"]);
        var vid_name = transfers_to_videos[selected_target][selected_source]
        //alert(vid_name);

        // Now add all the videos to the video sidebar on the right, one row at a time
        // vid_name = videos[node];
        //if (vid_name == undefined || vid_name['ours'].includes("NONE")) { // Some nodes do not have videos
            //return;
        //}

        var cls = 'wait-to-start';

        //alert(!source_exists.includes(selected_target));
        if(!source_exists.includes(selected_target)) {
            var titleElem = makeRowTitle(selected_target);
            document.getElementById(vidTitleElementForTarget(selected_target)).appendChild(titleElem);

            // document.getElementById(vidElementForTarget(selected_target)).appendChild(makeRowTitle(selected_target));
            var source = makeVideoFrame("Input video (<b><i>X</i><sub>1</sub> </b>)", "https://storage.googleapis.com/cross-task-website/assets/reduced_flicker/cropped_trimmed/source_final_down.mp4?authuser=0&folder=true&organizationId=true&supportedpurview=project");
            //document.getElementById(vidBaselineElementForTarget(selected_target)).setAttribute("data-spy", "affix");
            //document.getElementById(vidBaselineElementForTarget(selected_target)).setAttribute("data-offset-top", "01");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
            source_exists.push(selected_target);

            // Add targets
            // Baseline
            source = makeVideoFrame('Baseline U-Net Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)', transfers_to_videos[selected_target]["target"]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["target"]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            document.getElementById(vidElementForTarget(selected_target)).style = "margin-bottom:105px";
            }

         if(!other_exists.includes(selected_target)) {



            //Additional baselines for Normals
            if ((other_baselines == "Yes") && (selected_target=="Normals")){
            // First clear everything and add input + targets
            document.getElementById("video-section").innerHTML = "";
               all_videos = [];
               source_exists = [];
               other_exists = [];
               createVideoPlaceholders();
               
               if(!source_exists.includes(selected_target)) {
            var titleElem = makeRowTitle(selected_target);
            document.getElementById(vidTitleElementForTarget(selected_target)).appendChild(titleElem);

            // document.getElementById(vidElementForTarget(selected_target)).appendChild(makeRowTitle(selected_target));
            var source = makeVideoFrame("Input video (<b><i>X</i><sub>1</sub> </b>)", "https://storage.googleapis.com/cross-task-website/assets/reduced_flicker/cropped_trimmed/source_final_down.mp4?authuser=0&folder=true&organizationId=true&supportedpurview=project");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
            source_exists.push(selected_target);

            // Add targets
            // Baseline
            source = makeVideoFrame('Baseline U-Net Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)', transfers_to_videos[selected_target]["target"]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["target"]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            document.getElementById(vidElementForTarget(selected_target)).style = "margin-bottom:105px";
            }
                
            

            // Then add the other baselines
           
            source = makeVideoFrame("Cycle-Consistency Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['cycle']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
               

            source = makeVideoFrame("GeoNet Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['geonet']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame("Multitask Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['multitask']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame("Taskonomy Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['taskonomy']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            other_exists.push(selected_target);
            }

            //Additional baselines for Reshading
            if ((other_baselines == "Yes") && (selected_target=="Reshading")){

            // First clear everything and add input + targets
            document.getElementById("video-section").innerHTML = "";
               all_videos = [];
               source_exists = [];
               other_exists = [];
               createVideoPlaceholders();

               if(!source_exists.includes(selected_target)) {
            var titleElem = makeRowTitle(selected_target);
            document.getElementById(vidTitleElementForTarget(selected_target)).appendChild(titleElem);

            // document.getElementById(vidElementForTarget(selected_target)).appendChild(makeRowTitle(selected_target));
            var source = makeVideoFrame("Input video (<b><i>X</i><sub>1</sub> </b>)", "https://storage.googleapis.com/cross-task-website/assets/reduced_flicker/cropped_trimmed/source_final_down.mp4?authuser=0&folder=true&organizationId=true&supportedpurview=project");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
            source_exists.push(selected_target);

            // Add targets
            // Baseline
            source = makeVideoFrame('Baseline U-Net Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)', transfers_to_videos[selected_target]["target"]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["target"]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            document.getElementById(vidElementForTarget(selected_target)).style = "margin-bottom:105px";
            }



            source = makeVideoFrame("Multitask Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['multitask']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame("Taskonomy Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['taskonomy']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
 
            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);


            other_exists.push(selected_target);
            }


            //Additional baselines for Z-Depth
            if ((other_baselines == "Yes") && (selected_target=="Depth")){

            // First clear everything and add input + targets
            document.getElementById("video-section").innerHTML = "";
               all_videos = [];
               source_exists = [];
               other_exists = [];
               createVideoPlaceholders();

               if(!source_exists.includes(selected_target)) {
            var titleElem = makeRowTitle(selected_target);
            document.getElementById(vidTitleElementForTarget(selected_target)).appendChild(titleElem);

            // document.getElementById(vidElementForTarget(selected_target)).appendChild(makeRowTitle(selected_target));
            var source = makeVideoFrame("Input video (<b><i>X</i><sub>1</sub> </b>)", "https://storage.googleapis.com/cross-task-website/assets/reduced_flicker/cropped_trimmed/source_final_down.mp4?authuser=0&folder=true&organizationId=true&supportedpurview=project");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
            source_exists.push(selected_target);

            // Add targets
            // Baseline
            source = makeVideoFrame('Baseline U-Net Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)', transfers_to_videos[selected_target]["target"]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["target"]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            document.getElementById(vidElementForTarget(selected_target)).style = "margin-bottom:105px";
            }


            source = makeVideoFrame("GeoNet Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['geonet']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame("Multitask Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['multitask']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame("Taskonomy Prediction (<b><i>X</i><sub>1</sub>→<i>X</i><sub>2</sub> </b>)", transfers_to_videos[selected_target]["Others"]['taskonomy']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            other_exists.push(selected_target);
            }


            // Add perceps
            // Baseline
            //source = makeVideoFrame('Baseline', transfers_to_videos[selected_target][selected_source]['baseline']);
            //document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            // Consistency
            //source = makeVideoFrame("Consistency", transfers_to_videos[selected_target][selected_source]['ours']);
            //document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

           

            
           
             }


        //var title = "From: " + transferToTitleElement[selected_source.replace(/\//g, " + ")];
        //var ours = makeVideoFrame(title, vid_name['ours']);
        //document.getElementById(vidElementForTarget(selected_target)).appendChild(ours[0]);
        //all_videos.push(ours[1]);
              
            if ((selected_source != "All") && (selected_source!= "--")) {
            //alert(selected_source);
            // Add perceps
            // Baseline
                
            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);
            

                      
            source = makeVideoFrame('Baseline Readout ' + selected_source + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);
            }

            if (selected_source == "All") {
            //alert("Source is all!");
            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source1"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source2"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);
          

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source3"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source4"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);
           

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source5"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source6"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            source = makeVideoFrame('', "empty");
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            //all_videos.push(source[1]);

            var selected_source_now = transfers_to_videos[selected_target]["All"]["source7"];
              source = makeVideoFrame('Baseline Readout ' + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['baseline']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

            // Consistency
            source = makeVideoFrame("Consistency Readout " + selected_source_now + " (<b><i>X</i><sub>2</sub>→<i>X</i><sub>3</sub> </b>)", transfers_to_videos[selected_target][selected_source_now]['ours']);
            document.getElementById(vidBaselineElementForTarget(selected_target)).appendChild(source[0]);
            all_videos.push(source[1]);

        }
        //var bttn = document.getElementById("pauseDemo");
        //bttn.value = "Play";
        syncAllVideos(all_videos);
        // all_videos = all_videos.concat([source, ours]);

    });     
    
    $(document).ready(function () { 
        $("body").tooltip({   
            trigger: "hover",
            selector: "[data-toggle='tooltip']",
            container: "body",
            html: true

        })
    });

   
    
            $('#targetpicker').on('change',function(){
        if($('#targetpicker option:selected').val()=='Normals'){
          
            $('#sourcepicker option').remove();
            //$('#sourcepicker select').append($('<option value="90x55">90x55</option>)'))
            //.append($('<option value="90x50">90x50</option>)'))
            var x = document.getElementById("sourcepicker");

            x.options[x.options.length] = new Option('--', '--');        
            x.options[x.options.length] = new Option('Depth', 'Depth');
            x.options[x.options.length] = new Option('Reshading', 'Reshading');
            x.options[x.options.length] = new Option('Curvature', 'Curvature');
            x.options[x.options.length] = new Option('2D Keypoints', '2D Keypoints');
            x.options[x.options.length] = new Option('3D Keypoints', '3D Keypoints');
            x.options[x.options.length] = new Option('2D Edges', '2D Edges');  
            x.options[x.options.length] = new Option('Occlusion Edges', 'Occlusion Edges');  
            x.options[x.options.length] = new Option('All', 'All');         

            $('#sourcepicker').selectpicker('refresh');
        }
        if($('#targetpicker option:selected').val()=="Reshading"){
         
            $('#sourcepicker option').remove();
            //$('#sourcepicker select').append($('<option value="210x100">210x100</option>)'))
            //.append($('<option value="297x210">297x210</option>)'))
            var x = document.getElementById("sourcepicker");
            x.options[x.options.length] = new Option('--', '--');
            x.options[x.options.length] = new Option('Depth', 'Depth');
            x.options[x.options.length] = new Option('Normals', 'Normals');
            x.options[x.options.length] = new Option('Curvature', 'Curvature');
            x.options[x.options.length] = new Option('2D Keypoints', '2D Keypoints');
            x.options[x.options.length] = new Option('3D Keypoints', '3D Keypoints');
            x.options[x.options.length] = new Option('2D Edges', '2D Edges');
            x.options[x.options.length] = new Option('Occlusion Edges', 'Occlusion Edges');
            x.options[x.options.length] = new Option('All', 'All');
            
            $('#sourcepicker').selectpicker('refresh');

        }

        if($('#targetpicker option:selected').val()=="Depth"){

            $('#sourcepicker option').remove();
            //$('#sourcepicker select').append($('<option value="210x100">210x100</option>)'))
            //.append($('<option value="297x210">297x210</option>)'))
            var x = document.getElementById("sourcepicker");
            x.options[x.options.length] = new Option('--', '--');
            x.options[x.options.length] = new Option('Reshading', 'Reshading');
            x.options[x.options.length] = new Option('Normals', 'Normals');
            x.options[x.options.length] = new Option('Curvature', 'Curvature');
            x.options[x.options.length] = new Option('2D Keypoints', '2D Keypoints');
            x.options[x.options.length] = new Option('3D Keypoints', '3D Keypoints');
            x.options[x.options.length] = new Option('2D Edges', '2D Edges');
            x.options[x.options.length] = new Option('Occlusion Edges', 'Occlusion Edges');
            x.options[x.options.length] = new Option('All', 'All');

            $('#sourcepicker').selectpicker('refresh');

        }
    })
    


    $.get('../assets/transfers_to_videos.json', function(data) {
        transfers_to_videos = data;
        //alert("Hey");
        var transfers_targets = Array.from(Object.keys(transfers_to_videos));
        transfers_targets.sort();
        
        // List target transfers
        // var innerHTML = "";
        for (var i in transfers_targets) {
            var key = transfers_targets[i];
            if (transfers_to_videos[key]["target"]['ours'] == "NONE") { // These can't be vized
                continue;
            }
            valid_targets.push(key);
            // innerHTML = innerHTML + '<option value="' + key + '">' + key + '</option>\n';
        }
        createVideoPlaceholders();

        // document.getElementById("targetpicker").innerHTML = innerHTML;
        // console.log(innerHTML);
        $(document).ready(function () {
            $(document).ready(function () {
                //$('#targetpicker').selectpicker('val', 'Normals');
                //addSources();
                document.getElementById("targetpicker").addEventListener("change", addSources, false);    
                document.getElementById("sourcepicker").addEventListener("change", replaceSourcpickerTitle, false);    
                // $('#targetpicker').selectpicker('refresh');
            
          

            });
        });
    
    });


})(jQuery);

