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

exports.deleteMessage = async (req, res) => {
	const { id } = req.params;
	try {
		const msg = await Message.findById(id);
		if (!msg) return res.status(404).json({ message: 'Message not found' });
		// only sender can delete
		if (msg.sender.toString() !== req.user.id) {
			console.warn('delete forbidden: msg.sender=%s req.user.id=%s id=%s', msg.sender.toString(), req.user.id, id)
			return res.status(403).json({ message: 'Forbidden' });
		}
		// use model deletion to avoid document method differences across mongoose versions
		await Message.findByIdAndDelete(id);
		return res.json({ message: 'Deleted', id });
	} catch (err) {
		console.error('deleteMessage error', err);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteConversation = async (req, res) => {
	const { conversationId } = req.params;
	try {
		// conversationId format expected as "id1:id2"
		const parts = (conversationId || '').split(':').filter(Boolean);
		if (!parts.length) return res.status(400).json({ message: 'Invalid conversationId' });
		// requester must be one of the participants
		if (!parts.includes(req.user.id)) return res.status(403).json({ message: 'Forbidden' });
		await Message.deleteMany({ conversationId });
		return res.json({ message: 'Conversation deleted', conversationId });
	} catch (err) {
		console.error('deleteConversation error', err);
		return res.status(500).json({ message: 'Server error' });
	}
};