// Node.js socket client script
//172.23.105.241
const net = require('net');

// Connect to a server @ port 9898
const client = net.createConnection({ port: 16534, host: '2.tcp.ngrok.io' }, () => {
		setInterval(function(){
			client.write('Chris');
		}, 123);
});

client.on('data', (data) => {
  console.log(data.toString());
  //client.end();
});

client.on('end', () => {
  console.log('CLIENT: disconnected');
});