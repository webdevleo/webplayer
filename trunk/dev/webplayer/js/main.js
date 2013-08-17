(function(){

	var gui = require('nw.gui'), // Include GUI api
		win = gui.Window.get(), // Get window object
		tray;
	
	// Get path to app
	var path = require('path'),
		homeURL = path.dirname(process.execPath) + path.sep; // Home dir path

	$('js').on('click',function(e){ e.preventDefault(); }); // PreventDefault

	/****************************
	** Minimize window to tray **
	*****************************/
	$('#hide_btn').on('click', function(e){
		win.minimize();
	});

	// win.on('minimize', function() {
	// 	if(win !== null){
	// 		win = null;
	// 		// this.minimize(); // Hide window
	// 		this.hide();

	// 		tray = new gui.Tray({ icon: 'img/play.png' });
	// 	}
	// 	else{
	// 		tray.on('click', function() { // Show window and remove tray when clicked
	// 			win = gui.Window.get();
	// 			win.show();
	// 			win.restore();

	// 			this.remove();
	// 			tray = null;
	// 		});
	// 	}
	// });

})();