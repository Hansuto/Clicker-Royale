var io = require('socket.io').listen(8123);
var time = 30;
var gameInProgress = true;
var lastWinner = '';
var leaderboard = [];

io.on('connection', function(socket) {
  socket.on('click', function(data) {
		
		
		var parsedData = JSON.parse(data)
		
		console.log(parsedData)
		
		let obj = leaderboard.find((o, i) => {
			if (o.name === parsedData.name) {
					if(gameInProgress) {
						var newScore = o.score + parsedData.increment
						if (newScore <= 0 ) newScore = 0;
						leaderboard[i] = { name: o.name, score: newScore };
					}
					return true;
			}
		});
		
		if (obj == null) {
			leaderboard.push({"name" : parsedData.name,"score" : 1,});
		}
		
		leaderboard = leaderboard.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
	
		io.emit("update",
			JSON.stringify(
				{
					gameInProgress: gameInProgress,
					timeLeft: time,
					winner: lastWinner,
					leaderboard: leaderboard
				}
			)
		);
  });
});


setInterval(function(){
	leaderboard = leaderboard.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
	
	io.emit("update",
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


setInterval(function(){
		time -= 1;
		
		if (time <= 0) time = 0;
		
		if (time <= 0 && leaderboard.length != 0) {
			if (gameInProgress) {
					var winner = leaderboard.reduce((p, c) => p.score > c.score ? p : c);
					lastWinner = winner.name;
					console.log('******* Winner: ' + winner.name + ' *******')
			}
			else {
					console.log('******* Game Starting *******')
					leaderboard = []
			}
			gameInProgress = !gameInProgress			
			time = 30;
		}
		
		//console.log(leaderboard);
}, 1000);