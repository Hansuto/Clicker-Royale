// Node.js socket client script
//172.23.105.241
const net = require('net');
const myName = 'Rob'

// Connect to a server @ port 9898
const client = net.createConnection({ port: 16534, host: '2.tcp.ngrok.io' }, () => {
		setInterval(function(){
			client.write(myName);
		}, 1000);
});

client.on('data', (data) => {
	var response = JSON.parse(data);
	console.log(response);
	
	var timeLeft = response.timeLeft;
	var gameInProgress = response.gameInProgress;
	var leaderboard = response.leaderboard;
	var lastWinner = response.winner;
	var myScore;
	
	if (leaderboard.length != 0 && gameInProgress) {
		myScore = leaderboard.find(x => x.name === myName).score;
	}
	console.log(myScore);
  //client.end();
});

client.on('error', () => {
  console.log('SERVER: disconnected');
});

client.on('end', () => {
  console.log('CLIENT: disconnected');
});