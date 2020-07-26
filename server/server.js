var io = require('socket.io').listen(8123);
var time = 60;
var gameInProgress = true;
var lastWinner = '';
var leaderboard = [];

io.on('connection', function(socket) {
  socket.on('click', function(data) {
		let obj = leaderboard.find((o, i) => {
			if (o.name === data.toString()) {
					if(gameInProgress)
						leaderboard[i] = { name: o.name, score: o.score + 1 };
					return true;
			}
		});
		
		if (obj == null) {
			leaderboard.push({"name" : data.toString(),"score" : 1,});
		}
		
		setInterval(function(){
			leaderboard = leaderboard.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
			
			socket.emit("update",
				JSON.stringify(
					{
						gameInProgress: gameInProgress,
						timeLeft: time,
						winner: lastWinner,
						leaderboard: leaderboard
					}
				)
			);
		}, 1000);
  });
	
});

setInterval(function(){
		time -= 1;
		
		if (time <= 0 && leaderboard.length != 0) {
			if (gameInProgress) {
					var winner = leaderboard.reduce((p, c) => p.score > c.score ? p : c);
					lastWinner = winner.name;
					console.log('******* Winner: ' + winner.name + ' *******')
			}
			else {
					console.log('******* Game Starting *******')
			}
			gameInProgress = !gameInProgress			
			leaderboard = []
			time = 60;
		}
		
		console.log(leaderboard);
}, 1000);