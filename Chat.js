const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 5002;

app.get('/', (req, res) => {
	res.send('Hello');
});

const getOnlineUsers = () => {
	const clients = io.sockets.clients().connected;
	const sockets = Object.values(clients);
	const users = sockets.map((socket) => socket.user);
	return users.filter((user) => user !== undefined);
};

io.on('connection', (socket) => {
	console.log('connected');

	const emitOnlineUsers = () => {
		socket.broadcast.emit('users', getOnlineUsers());
	};

	socket.on('add_user', (user) => {
		socket.emit('server_message', {
			name: 'Gediminas',
			message: `Welcome ${user.name}`,
		});

		socket.broadcast.emit('server_message', {
			name: 'Gediminas',
			message: `${user.name} just Join Chat`,
		});

		socket.user = user;
		emitOnlineUsers();
	});
	socket.on('message', (message) => {
		message.name = socket.user.name;
		socket.broadcast.emit('message', message);
	});

	socket.on('typing', () => {
		const name = socket.user.name;
		socket.broadcast.emit('typing', `${name} is typing`);
	});

	socket.on('stopped_typing', () => {
		socket.broadcast.emit('stopped_typing');
	});

	socket.on('disconnect', () => {
		const { user } = socket;
		if (user) {
			socket.broadcast.emit('server_message', {
				name: 'Gediminas',
				message: `${user.name} just left Chat`,
			});
		}

		emitOnlineUsers();
	});
});

http.listen(port, () => console.log(`listen on :${port}`));
