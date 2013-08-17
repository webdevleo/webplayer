(function(){
	window.resizeTo(420, 190); // Fix resize with tool bar

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

})();