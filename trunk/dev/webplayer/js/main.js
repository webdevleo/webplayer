var files = new Array(),
	currentTrack = 0,
	player = null;

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
    document.querySelector("input").onchange = function(e) {
    	files = e.target.files;
    	if(files.length){
    		$('#playlist_panel > *').remove();
	        if (player) player.stop();

	        var i = 0;
	        var recurs = function recursF(){
				window.setTimeout(function(){
		        	asset = AV.Asset.fromFile(files[i]);
		        	
		        	var time = '--:--',
		        		title = 'Unknown track';

					asset.get('duration', function(duration) {});

			        asset.on('metadata', function(data) {
			        	title = data.title || title;

			            var track = '<div onclick="playTrackSingle(this);" data-title="'+title+'" class="column no-drag">'+
			            				'<div class="track_number"></div>'+
			            				'<div class="track_name"><span>'+title+'</span></div>'+
			            				'<div class="track_time">'+time+'</div>'+
			            			'</div>';
			            			
			    		$('#playlist_panel').append(track);
			        });

					if(i <= files.length){
						recurs();
						i++;
					}
		        }, 1);
	        }
	        recurs();

	   //      for (var i = 0; i <= files.length - 1; i++) {
	   //      	asset = AV.Asset.fromFile(files[i]);
	        	
	   //      	var time = '--:--',
	   //      		title = 'Unknown track';

				// asset.get('duration', function(duration) {});

		  //       asset.on('metadata', function(data) {
		  //       	title = data.title || title;

		  //           var track = '<div onclick="playTrackSingle(this);" data-title="'+title+'" class="column no-drag">'+
		  //           				'<div class="track_number"></div>'+
		  //           				'<div class="track_name"><span>'+title+'</span></div>'+
		  //           				'<div class="track_time">'+time+'</div>'+
		  //           			'</div>';
		            			
		  //   		$('#playlist_panel').append(track);
		  //       });
	   //      };

	        player = AV.Player.fromFile(files[0]);
	        player.on('error', function(e) { throw e });

	        // player.on('metadata', function(data) {
	        //     console.log(data);
	        // });

			// player.on('progress', function(percent) {
			//     console.log(percent);
			// });
    	}
    }

    $('#play_btn').on('click', function(e){
    	if (player){
    		player.play();
    		if(!$('.checked').length){
    			$($('.column')[0]).addClass('checked');
    			continuePlaying(0);
    		}
    		else
    		{
    			currentTrack = $('.column').index($('.checked'));
    			continuePlaying(currentTrack);
    		}
    	}
    });

    $('#pause_btn').on('click', function(e){
    	player.pause();
    });

    $('#stop_btn').on('click', function(e){
		player.stop();
		currentTrack = $('.column').index($('.checked'));
		player = AV.Player.fromFile(files[currentTrack]);
    });

    $('#prev_btn').on('click', function(e){
		if(currentTrack)
			currentTrack--;
		else
			currentTrack = files.length-1;

		playTrack(currentTrack);
    });

    $('#next_btn').on('click', function(e){
		if(currentTrack < files.length -1)
			currentTrack++;
		else
			currentTrack = 0;

		playTrack(currentTrack);
    });

	$('#volume_panel a').on('click', function(e) {
		var listItem = this,
			volumeLevel = $('#volume_panel a').index(listItem)+1;

		player.volume = volumeLevel*10;
		$('#volume_panel a').removeClass("active");
		$( "#volume_panel a:lt("+volumeLevel+")" ).addClass('active');
	});

})();

$(document).ready(function() {

	if(localStorage.getItem("playlist_box"))
		$('#playlist_box').show();
	if(localStorage.getItem("add_box"))
		$('#add_box').show();
	window_size();

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
    });

});

var playTrack = function playTrackF(index){
	$(".column").removeClass('checked');
	$($('.column')[index]).addClass('checked');
	player.stop();
	player = AV.Player.fromFile(files[index]);
	player.play();
	continuePlaying(index);
}

var continuePlaying = function continuePlayingF(index){
	$('#name_block span').html($($('.column')[index]).data('title'));

	player.on('duration', function(duration) {
		$($('.column')[index]).data('duration', duration);
		var currentTime = convertMS(duration);
		$($('.column')[index]).find('.track_time').html(
			(currentTime.m < 10 ? '0'+ currentTime.m : currentTime.m) +
			':' +
			(currentTime.s < 10 ? '0'+ currentTime.s : currentTime.s)
		);
	});

	player.on('progress', function(durationLeft) {

		var duration = $($('.column')[index]).data('duration'),
			currentTime = convertMS(duration-durationLeft),
	    	onePercetMs = duration / 100,
	    	progressBarPercent = durationLeft / onePercetMs;

	    $('#progress_pointer').css({'left': progressBarPercent+"%"});

		$('#time').html(
			(currentTime.m < 10 ? '0'+ currentTime.m : currentTime.m) +
			':' +
			(currentTime.s < 10 ? '0'+ currentTime.s : currentTime.s)
		);

		// TODO Check for Shuffle & Repeat
		if(currentTime.m == 0 && currentTime.s == 0){
			index = ($('.column').length === index+1) ? 0 : index + 1;
			playTrack(index);
			console.log('test');
		}
	});
}

var playTrackSingle = function playTrackSingleF(_this){
	var index = $(".column").index(_this);
	playTrack(index);
}

function convertMS(ms) {
	var d, h, m, s;
	s = Math.floor(ms / 1000);
	m = Math.floor(s / 60);
	s = s % 60;
	h = Math.floor(m / 60);
	m = m % 60;
	d = Math.floor(h / 24);
	h = h % 24;
	return { d: d, h: h, m: m, s: s };
};