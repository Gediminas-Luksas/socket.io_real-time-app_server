const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 5000;

app.get('/', (req, res) => {
	res.send('Hello');
});

const getVisitors = () => {
	const clients = io.sockets.clients().connected;
	const sockets = Object.values(clients);
	const users = sockets.map((socket) => socket.user);
	return users;
};
const emitVisitors = () => {
	io.emit('visitors', getVisitors());
};

io.on('connection', (socket) => {
	console.log('connected');

	socket.on('new_visitor', (user) => {
		console.log('new visitor', user);
		socket.user = user;
		emitVisitors();
	});

	socket.on('disconnect', () => {
		console.log('disconnect');
		emitVisitors();
	});
});

http.listen(port, () => console.log(`listen on :${port}`));
