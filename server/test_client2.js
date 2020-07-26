var io = require('socket.io-client');
var socket = io.connect('http://hansuto.ngrok.io');
const myName = 'Rob'

setInterval(function(){
	socket.emit('click', myName);
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
