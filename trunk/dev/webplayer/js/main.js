(function(){
	
	$('.no-drag').on('mouseover', function(){
		$('html').removeClass('draggable');
	}).on('mouseout', function(){
		$('html').addClass('draggable');
	});

	var gui = require('nw.gui'), // Include GUI api
		win = gui.Window.get(), // Get window object
		tray;
	
	// Get path to app
	var path = require('path'),
		homeURL = path.dirname(process.execPath) + path.sep; // Home dir path

	$('js').on('click',function(e){ e.preventDefault(); }); // PreventDefault

	/*********************************
	** Minimize and maximize window **
	**********************************/
	$('#hide_btn').on('click', function(){
		win.hide();
		tray = new gui.Tray({ icon: 'img/play.png' });

		tray.on('click', function() { // Show window and remove tray when clicked
			win.show();
			win.focus();
			this.remove();
			tray = null;
		});
	});

	/**********************
	** Close Application **
	***********************/
	$('#close_btn').on('click',function(){ win.close();	});

	/******************************
	** Main Player Functionality **
	*******************************/
	var files = new Array(),
		currentTrack = 0,
		player = null;

    document.querySelector("input").onchange = function(e) {
    	files = e.target.files;
    	if(files.length){
    		$('#playlist_panel > *').remove();
	        if (player) player.stop();

	        for (var i = 0; i <= files.length - 1; i++) {
	        	asset = AV.Asset.fromFile(files[i]);
	        	
	        	var time = '00:00',
	        		title = 'Unknown track';

				asset.get('duration', function(duration) {
					seconds = ~~(duration / 1000);
					minutes = ~~(seconds / 60);

					if(minutes.length < 2) minutes = '0' + minutes;
					time = minutes + ':' + seconds.toString().substring(0, 2);
				});

		        asset.on('metadata', function(data) {
		        	title = data.title;
		            var track = '<div class="column no-drag">'+
		            				'<div class="track_number"></div>'+
		            				'<div class="track_name"><span>'+title+'</span></div>'+
		            				'<div class="track_time">'+time+'</div>'+
		            			'</div>';
		            			
		    		$('#playlist_panel').append(track);
		        });


	        };

	        player = AV.Player.fromFile(files[0]);
	        player.on('error', function(e) { throw e });

	        // player.on('metadata', function(data) {
	        //     console.log(data);
	        // });
    	}
    }

    $('#play_btn').on('click', function(e){
    	if (player) player.play();
    });

    $('#pause_btn').on('click', function(e){
    	player.pause();
    });

    $('#stop_btn').on('click', function(e){
		player.stop();
		player = AV.Player.fromFile(files[currentTrack]);
    });

    $('#prev_btn').on('click', function(e){
		if(currentTrack)
			currentTrack--;
		else
			currentTrack = files.length-1;

		player.stop();
		player = AV.Player.fromFile(files[currentTrack]);
		player.play();
    });

    $('#next_btn').on('click', function(e){
		if(currentTrack < files.length -1)
			currentTrack++;
		else
			currentTrack = 0;

		player.stop();
		player = AV.Player.fromFile(files[currentTrack]);
		player.play();
    });

})();

$(document).ready(function() {

	if(localStorage.getItem("playlist_box"))
		$('#playlist_box').show();
	if(localStorage.getItem("add_box"))
		$('#add_box').show();
	window_size();

	$('#volume_panel a').click(function(event) {
		var listItem = this;
		var volume = $('#volume_panel a').index(listItem)+1;
		$('#volume_panel a').removeClass("active");
		$( "#volume_panel a" ).each(function ( index, domEle) {
			$( domEle ).addClass( "active" );
			if ( $(this).is( ".volume_point_"+volume ) ) {
				return false;
			}
		});
	});

	function window_size(){
		var height = 135;
		if($('#add_box').is(':visible'))
			height += 135;
		if($('#playlist_box').is(':visible'))
			height += 400;
		window.resizeTo( 420, height);
	}

	$('#pl_btn').click(function(event) {
		if ( $("#playlist_box").hasClass("active") ) {
			$('#playlist_box').hide();
			$('#playlist_box').removeClass('active');
			localStorage.setItem("playlist_box", false);
		}else{
			$('#playlist_box').show();
			$('#playlist_box').addClass('active');
			localStorage.setItem("playlist_box", true);
		}
		window_size();
		// console.log(localStorage.getItem("playlist_box"));	
    });

	$('#add_btn').click(function(event) {
		if ( $("#add_box").hasClass("active") ) {
			$('#add_box').hide();
			$('#add_box').removeClass('active');
			localStorage.setItem("add_box", false);
		}else{
			$('#add_box').show();
			$('#add_box').addClass('active');
			localStorage.setItem("add_box", true);
		}	
		window_size();
		// console.log(localStorage.getItem("add_box"));	
    });

});
