const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { jwtSecret } = require('../config');
const { sendVerificationEmail } = require('../services/emailService');


exports.register = async (req, res) => {
const { username, email, password } = req.body;

// Validation
if (!username || !email || !password) {
	return res.status(400).json({ message: 'Username, email, and password are required' });
}

// Basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
	return res.status(400).json({ message: 'Invalid email format' });
}

try {
// Check if username or email already exists
const existingUser = await User.findOne({ $or: [{ username }, { email }] });
if (existingUser) {
	if (existingUser.username === username) {
		return res.status(400).json({ message: 'Username already taken' });
	}
	if (existingUser.email === email) {
		return res.status(400).json({ message: 'Email already registered' });
	}
}

// Hash password
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

// Generate verification token
const verificationToken = crypto.randomBytes(32).toString('hex');
const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

// Create user
const user = new User({ 
	username, 
	email,
	passwordHash: hash,
	verificationToken,
	verificationTokenExpires,
	isVerified: false
});
await user.save();

// Send verification email
try {
	await sendVerificationEmail(email, username, verificationToken);
	res.status(201).json({ 
		message: 'Registration successful! Please check your email to verify your account.',
		email: email
	});
} catch (emailError) {
	console.error('Email sending failed:', emailError);
	// User is created but email failed
	res.status(201).json({ 
		message: 'Registration successful, but verification email failed to send. Please request a new verification email.',
		email: email
	});
}
} catch (err) {
	console.error('Register error:', err);
	// Handle duplicate key errors
	if (err && err.code === 11000) {
		if (err.keyPattern?.username) {
			return res.status(400).json({ message: 'Username already taken' });
		}
		if (err.keyPattern?.email) {
			return res.status(400).json({ message: 'Email already registered' });
		}
		return res.status(400).json({ message: 'Username or email already taken' });
	}
	return res.status(500).json({ message: 'Server error' });
}
};


exports.login = async (req, res) => {
const { username, password } = req.body;
try {
const user = await User.findOne({ username });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });

// Check if email is verified
if (!user.isVerified) {
	return res.status(403).json({ 
		message: 'Please verify your email before logging in. Check your inbox for the verification link.',
		requiresVerification: true,
		email: user.email
	});
}

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
		res.json({ user: { id: user._id, username: user.username, email: user.email } });
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

// Verify email with token
exports.verifyEmail = async (req, res) => {
	const { token } = req.query;
	
	if (!token) {
		return res.status(400).json({ message: 'Verification token is required' });
	}
	
	try {
		const user = await User.findOne({ 
			verificationToken: token,
			verificationTokenExpires: { $gt: Date.now() }
		});
		
		if (!user) {
			return res.status(400).json({ 
				message: 'Invalid or expired verification token. Please request a new verification email.' 
			});
		}
		
		// Mark user as verified
		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpires = undefined;
		await user.save();
		
		res.json({ 
			message: 'Email verified successfully! You can now log in.',
			verified: true
		});
	} catch (err) {
		console.error('Email verification error:', err);
		res.status(500).json({ message: 'Server error' });
	}
};

// Resend verification email
exports.resendVerification = async (req, res) => {
	const { email } = req.body;
	
	if (!email) {
		return res.status(400).json({ message: 'Email is required' });
	}
	
	try {
		const user = await User.findOne({ email });
		
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		
		if (user.isVerified) {
			return res.status(400).json({ message: 'Email is already verified' });
		}
		
		// Generate new verification token
		const verificationToken = crypto.randomBytes(32).toString('hex');
		const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
		
		user.verificationToken = verificationToken;
		user.verificationTokenExpires = verificationTokenExpires;
		await user.save();
		
		// Send verification email
		await sendVerificationEmail(email, user.username, verificationToken);
		
		res.json({ 
			message: 'Verification email sent! Please check your inbox.',
			email: email
		});
	} catch (err) {
		console.error('Resend verification error:', err);
		res.status(500).json({ message: 'Failed to send verification email' });
	}
};

// Placeholder for Web3 signature login (future)
exports.web3Login = async (req, res) => {
// Example: verify signature and map to walletAddress
res.status(501).json({ message: 'Not implemented' });
};