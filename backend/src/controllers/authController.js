const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtSecret, demoAccessCode } = require('../config');


exports.register = async (req, res) => {
const { username, password, accessCode } = req.body;

if (!username || !password) {
	return res.status(400).json({ message: 'Username and password are required' });
}

// Check demo access code if configured
if (demoAccessCode && accessCode !== demoAccessCode) {
	return res.status(403).json({ 
		message: 'Invalid access code. This is a demo app - please contact the owner for access.' 
	});
}

try {
const exists = await User.findOne({ username });
if (exists) return res.status(400).json({ message: 'Username already taken' });

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const user = new User({ username, passwordHash: hash });
await user.save();

const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '7d' });
		// Set httpOnly cookie
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});
		// Also send token in response body for mobile fallback (iOS Safari may not support httpOnly cookies)
		res.json({ user: { id: user._id, username: user.username }, token });
} catch (err) {
	console.error('Register error:', err);
	if (err && err.code === 11000) {
		return res.status(400).json({ message: 'Username already taken' });
	}
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
		// Set httpOnly cookie
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
		});
		// Also send token in response body for mobile fallback (iOS Safari may not support httpOnly cookies)
		res.json({ user: { id: user._id, username: user.username }, token });
} catch (err) {
	console.error('Login error:', err);
	res.status(500).json({ message: 'Server error' });
}
};


// Logout endpoint to clear the httpOnly cookie
exports.logout = async (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
	});
	res.json({ message: 'Logged out successfully' });
};

// Placeholder for Web3 signature login (future)
exports.web3Login = async (req, res) => {
// Example: verify signature and map to walletAddress
res.status(501).json({ message: 'Not implemented' });
};