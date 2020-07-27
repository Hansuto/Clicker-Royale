var io = require('socket.io-client');
var socket = io.connect('http://hansuto.ngrok.io');
const myName = 'Chris'

setInterval(function(){
	var message = JSON.stringify(
		{
			"name" : myName,
			"increment" : 1
		}
	)
	socket.emit('click', message);
}, 1000);

socket.on('update', (data) => {
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
