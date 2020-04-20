
(function($) {
    "use strict"
    
    /* --------------------------------------------------- */
	/*  Particle JS
	------------------------------------------------------ */
/*	$('.home-particles').particleground({
		dotColor: '#fff',
		lineColor: '#fff',
		particleRadius: 10,
		curveLines: true,
		density: 10000,
		proximity: 110
  */  });
    
    document.getElementById("learnmore").onclick = function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#abstract").offset().top
        }, 600);
    };

    $(document).ready(function($) {
		$('.counter').counterUp({
			delay: 10,
			time: 1000
		});
    });
    
    
	///////////////////////////
	// magnificPopup
	$('.work').magnificPopup({
		delegate: '.lightbox',
		type: 'iframe'
	});

	// Example 1: From an element in DOM
	$('.bibtex').magnificPopup({
		delegate: '.open-popup-link',	
		type:'inline',
		midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
    });
    

    /* Service box height */
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

    $( document ).ready (
        function () {
            ensureSameSize('service-row-1');
            ensureSameSize('service-row-2');
            $( window ).resize(function() {
                resizeMinHeight('service-row-1');
                resizeMinHeight('service-row-2');
            });
        }
    );
})(jQuery);
