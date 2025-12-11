// socket init and handlers


const socketio = require('socket.io');
const Message = require('./models/Message');


function initSocket(server, options = {}) {
const io = new socketio.Server(server, {
cors: { origin: options.clientOrigin || '*' }
});


// map userId -> socketId
const online = new Map();


io.on('connection', socket => {
console.log('socket connected', socket.id);


socket.on('user:online', (userId) => {
online.set(userId, socket.id);
socket.userId = userId;
io.emit('online:users', Array.from(online.keys()));
});


socket.on('send:message', async (payload) => {
// payload: { conversationId, sender, receiver, text }
const msg = new Message({ ...payload });
await msg.save();
// emit to receiver if online
const toSocket = online.get(payload.receiver);
if (toSocket) io.to(toSocket).emit('receive:message', msg);
// ack to sender
socket.emit('message:sent', msg);
});


socket.on('disconnect', () => {
if (socket.userId) online.delete(socket.userId);
io.emit('online:users', Array.from(online.keys()));
});
});


return io;
}


module.exports = initSocket;