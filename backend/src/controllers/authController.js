const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret } = require('../config');


exports.register = async (req, res) => {
const { username, password } = req.body;
try {
const exists = await User.findOne({ username });
if (exists) return res.status(400).json({ message: 'Username taken' });
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const user = new User({ username, passwordHash: hash });
await user.save();
const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, username: user.username } });
} catch (err) {
	console.error('Register error:', err);
	// handle duplicate key race (unique index)
	if (err && err.code === 11000) return res.status(400).json({ message: 'Username taken' });
	return res.status(500).json({ message: 'Server error' });
}
};


exports.login = async (req, res) => {
const { username, password } = req.body;
try {
const user = await User.findOne({ username });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.passwordHash);
if (!match) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, username: user.username } });
} catch (err) {
	console.error('Login error:', err);
	res.status(500).json({ message: 'Server error' });
}
};


// Placeholder for Web3 signature login (future)
exports.web3Login = async (req, res) => {
// Example: verify signature and map to walletAddress
res.status(501).json({ message: 'Not implemented' });
};