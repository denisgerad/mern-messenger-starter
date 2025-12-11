const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({
conversationId: { type: String, required: true },
sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
text: { type: String, default: '' },
mediaUrl: { type: String, default: '' },
encrypted: { type: Boolean, default: false },
read: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Message', MessageSchema);