(function(){
	// var file = readFile("/www/multimedia/music/Sting - Discografi [ studiinie albomi 1985 - 2010 ]/2010  Symphonicities/02.Englishman In New York.mp3");
	var player = AV.Player.fromURL("/www/multimedia/music/Sting - Discografi [ studiinie albomi 1985 - 2010 ]/2010  Symphonicities/02.Englishman In New York.mp3");
	console.log(player);
	// var player = AV.Player.fromFile(data);
	player.play();

})();