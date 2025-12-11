// socket init and handlers


const socketio = require('socket.io');
const Message = require('./models/Message');


function initSocket(server, options = {}) {
const io = new socketio.Server(server, {
cors: { origin: options.clientOrigin || '*' }
});


// map userId -> socketId and userId -> username
const online = new Map();
const usernames = new Map();


io.on('connection', socket => {
console.log('socket connected', socket.id);


	// payload can be either a userId string or an object { id, username }
	socket.on('user:online', (payload) => {
		const userId = typeof payload === 'string' ? payload : payload?.id
		const username = typeof payload === 'object' && payload?.username ? payload.username : null
		if (!userId) return
		online.set(userId, socket.id);
		socket.userId = userId;
		if (username) usernames.set(userId, username)
		// emit array of { id, username }
		const list = Array.from(online.keys()).map(id => ({ id, username: usernames.get(id) || id }))
		io.emit('online:users', list);
	});


socket.on('send:message', async (payload) => {
	// payload: { conversationId, sender, receiver, text }
	console.log('send:message payload:', payload)
	const msg = new Message({ ...payload });
	await msg.save();
	// emit to receiver if online
	const toSocket = online.get(payload.receiver);
	console.log('online keys:', Array.from(online.keys()))
	console.log('toSocket for receiver', payload.receiver, toSocket)
	if (toSocket) io.to(toSocket).emit('receive:message', msg);
	// ack to sender
	socket.emit('message:sent', msg);
});

	// forward delete events coming from client API actions
	socket.on('delete:message', ({ id, receiver }) => {
		const toSocket = online.get(receiver)
		if (toSocket) io.to(toSocket).emit('message:deleted', { id })
	})


	socket.on('disconnect', () => {
		if (socket.userId) {
			online.delete(socket.userId);
			usernames.delete(socket.userId);
		}
		const list = Array.from(online.keys()).map(id => ({ id, username: usernames.get(id) || id }))
		io.emit('online:users', list);
	});
});


return io;
}


module.exports = initSocket;