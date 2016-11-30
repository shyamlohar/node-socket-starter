module.exports = function (app, io) {
		
	var returnClients = [];

	//Render Home.html when User hits http://localhost:8080/ ----> [root page of application]
	app.get('/', function (req, res) {
		res.render('home');
	});

	var chat = io.on('connection', function (socket) {

		socket.on('disconnect', function () {
			//To-do: add user's name
			console.log('Someone Disconnected !!');
		});
		//To-do: add user's name when connect, 'broadcast'.
		console.log('Establised connection !');

		//Get number of connected clients.
		socket.on('load', function(data){
			console.log(io.engine.clientsCount); 				// console.log(Object.keys(io.sockets.connected).length);
		});

		//On new message event emit broadcast event that broadcasts callee's message to every other clients.
		socket.on('newMessage', function(data) {
			socket.broadcast.emit('broadcastMessage', data);
		});

		//When client starts typing, broadcast what he is typing.
		socket.on('typing', function(key){
			socket.broadcast.emit('someoneIsTyping', key);
		});

		//Hide typing <li> when client stops typing.
		socket.on('stoppedTyping', function(){
			socket.broadcast.emit('someoneHasStoppedTyping');
		});
	});
}