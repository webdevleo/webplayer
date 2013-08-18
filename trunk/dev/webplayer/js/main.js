(function(){
	// window.resizeTo(420, 300); // Fix resize with tool bar

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
        if (player) player.stop();

        player = AV.Player.fromFile(files[0]);
        player.on('error', function(e) { throw e });
        
        player.on('metadata', function(data) {
            console.log(data);
            this.play();
        });

    }

    $('#play_btn').on('click', function(e){
    	if (player) player.play();
    });

    $('#pause_btn').on('click', function(e){ if (player) player.pause(); });

    $('#stop_btn').on('click', function(e){
    	if (player){
    		player.pause();
    		player.currentTime(0);
    	}
    });

    $('#prev_btn').on('click', function(e){
    	if (player){
    		if(currentTrack) currentTrack--;
    		player = AV.Player.fromFile(files[currentTrack]);
    	}
    });

    $('#next_btn').on('click', function(e){
    	if (player){
    		if(currentTrack < files.length) currentTrack++;
    		player = AV.Player.fromFile(files[currentTrack]);
    	}
    });

})();