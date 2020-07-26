// Node.js socket server script
const net = require('net');

var time = 60;
var gameInProgress = true;
var lastWinner = '';
var leaderboard = [];

// Create a server object
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
	
		let obj = leaderboard.find((o, i) => {
			if (o.name === data.toString()) {
					if(gameInProgress)
						leaderboard[i] = { name: o.name, score: o.score + 1 };
					return true;
			}
		});
		
		if (obj == null) {
			leaderboard.push({"name" : data.toString(),"score" : 0,});
		}
  });
	
	socket.on("error", (err) => {
		// Throws error when client disconnects without client.end();
	});
	
	setInterval(function(){
		leaderboard = leaderboard.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
		
		socket.write(
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
	
  //socket.end('SERVER: Closing connection');
	
}).on('error', (err) => {
  console.error(err);
});

// Open server on port 9898
server.listen(9898, () => {
  console.log('opened server on', server.address().port);
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