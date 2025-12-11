const Message = require('../models/Message');


exports.sendMessage = async (req, res) => {
const { conversationId, sender, receiver, text, mediaUrl } = req.body;
try {
const msg = new Message({ conversationId, sender, receiver, text, mediaUrl });
await msg.save();
res.json({ message: msg });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};


exports.getMessages = async (req, res) => {
const { conversationId } = req.params;
try {
const msgs = await Message.find({ conversationId }).sort({ createdAt: 1 });
res.json({ messages: msgs });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
};