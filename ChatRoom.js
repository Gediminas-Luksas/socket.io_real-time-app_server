const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 5001;

app.get('/', (req, res) => {
	res.send('Hello');
});

io.on('connection', (socket) => {
	console.log('connected');

	socket.on('join_room', (room) => {
		socket.join(room);
	});

	socket.on('message', ({ room, message }) => {
		socket.to(room).emit('message', {
			message,
			name: 'Friend',
		});
	});

	socket.on('typing', ({ room }) => {
		socket.to(room).emit('typing', 'Something is typing');
	});

	socket.on('stopped_typing', ({ room }) => {
		socket.to(room).emit('stopped_typing');
	});
});

http.listen(port, () => console.log(`listen on :${port}`));
