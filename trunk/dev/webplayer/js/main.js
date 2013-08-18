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

        var playerData;
        for (var i = files.length - 1; i >= 0; i--) {
        	// console.log(files[i]);
        	playerData = AV.Player.fromFile(files[i]);
        	playerData.preload();
	        playerData.on('metadata', function(data) {
	            console.log(data);
	        });
        };

        player = AV.Player.fromFile(files[0]);
        player.on('error', function(e) { throw e });
        
        player.on('metadata', function(data) {
            console.log(data);
        });

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



	var dragSrcEl = null;
	var cols = document.querySelectorAll('#playlist_panel .column');
	[].forEach.call(cols, function(col) {
	  col.addEventListener('dragstart', handleDragStart, false);
	  col.addEventListener('dragenter', handleDragEnter, false)
	  col.addEventListener('dragover', handleDragOver, false);
	  col.addEventListener('dragleave', handleDragLeave, false);
	  col.addEventListener('drop', handleDrop, false);
	  col.addEventListener('dragend', handleDragEnd, false);
	});

	function handleDragStart(e) {
	  // Target (this) element is the source node.
	  dragSrcEl = this;
	  e.dataTransfer.effectAllowed = 'move';
	  e.dataTransfer.setData('text/html', this.innerHTML);
	}

	function handleDragEnter(e) { }

	function handleDragOver(e) {
	  if (e.preventDefault) {
	    e.preventDefault(); // Necessary. Allows us to drop.
	  }
	  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
	  return false;
	}

	function handleDragLeave(e) { }

	function handleDrop(e) {
	  if (e.stopPropagation) {
	    e.stopPropagation(); // Stops some browsers from redirecting.
	  }

	  // Don't do anything if dropping the same column we're dragging.
	  if (dragSrcEl != this) {
	    // Set the source column's HTML to the HTML of the columnwe dropped on.
	    dragSrcEl.innerHTML = this.innerHTML;
	    this.innerHTML = e.dataTransfer.getData('text/html');
	  }
	  return false;
	}

	function handleDragEnd(e) {	}

	var cols = document.querySelectorAll('#playlist_panel .column');
	[].forEach.call(cols, function(col) {
	  col.addEventListener('dragstart', handleDragStart, false);
	  col.addEventListener('dragenter', handleDragEnter, false)
	  col.addEventListener('dragover', handleDragOver, false);
	  col.addEventListener('dragleave', handleDragLeave, false);
	  col.addEventListener('drop', handleDrop, false);
	  col.addEventListener('dragend', handleDragEnd, false);
	});


});
