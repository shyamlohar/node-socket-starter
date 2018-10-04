module.exports = function (app, io) {

	const returnClients = [];

	//Render Home.html when User hits http://localhost:8080/ ----> [root page of application]
	app.get('/', (req, res) => {
		res.render('home');
	});

	const chat = io.on('connection', (socket) => {

		socket.on('disconnect', function () {
			//To-do: add user's name
			console.log('Someone Disconnected !!');
		});
		//To-do: add user's name when connect, 'broadcast'.
		console.log('Establised connection !');

		//Get number of connected clients.
		socket.on('load', (data) => {
			console.log(io.engine.clientsCount); 				// console.log(Object.keys(io.sockets.connected).length);
		});

		//On new message event emit broadcast event that broadcasts callee's message to every other clients.
		socket.on('newMessage', (data) => {
			socket.broadcast.emit('broadcastMessage', data);
		});

		//When client starts typing, broadcast what he is typing.
		socket.on('typing', (key) => {
			socket.broadcast.emit('someoneIsTyping', key);
		});

		//Hide typing <li> when client stops typing.
		socket.on('stoppedTyping', () => {
			socket.broadcast.emit('someoneHasStoppedTyping');
		});
	});
}