(function(){

	var gui = require('nw.gui'), // Include GUI api
		win = gui.Window.get(); // Get window object
	
	// Get path to app
	var path = require('path'),
		homeURL = path.dirname(process.execPath) + path.sep; // Home dir path

	/****************************
	** Minimize window to tray **
	*****************************/
	win.on('minimize', function() {
		this.hide(); // Hide window

		var tray = new gui.Tray({ title: 'WebPlayer', icon: 'img/play.png' });

		// Give it a menu
		var menu = new gui.Menu();
		menu.append(new gui.MenuItem({
			type: 'checkbox', label: 'Play/Pause',
			type: 'checkbox', label: 'Stop',
			type: 'checkbox', label: 'Close'
		}));
		tray.menu = menu;

		// Show window and remove tray when clicked
		tray.on('click', function() {
			win.show();
			this.remove();
			tray = null;
		});
	});

})();