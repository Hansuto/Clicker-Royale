// Node.js socket client script
const net = require('net');

// Connect to a server @ port 9898
const client = net.createConnection({ port: 16534, host: '2.tcp.ngrok.io' }, () => {
		setInterval(function(){
			client.write('Rob');
		}, 234);
});

client.on('data', (data) => {
  console.log(data.toString());
  //client.end();
});

client.on('end', () => {
  console.log('CLIENT: disconnected');
});