const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { port, mongoUri, clientOrigin } = require('./config');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const initSocket = require('./socket');


const app = express();
const server = http.createServer(app);

// CORS configuration for cross-origin cookies
const allowedOrigins = [
	clientOrigin,
	'http://localhost:5173',
	'http://localhost:3000',
	'https://mern-messenger-starter.vercel.app'
].filter(Boolean);

// Custom CORS middleware to ensure credentials header is always set
app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin) || !origin) {
		res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
		res.header('Access-Control-Expose-Headers', 'Set-Cookie');
	}
	
	// Handle preflight requests
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	
	next();
});

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint for cron jobs (e.g., ping from Render)
app.get('/cron/health', (req, res) => {
	res.status(200).send('Cron job OK');
});


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
	console.log('Mongo connected');
	// Drop the problematic email index if it exists
	const User = require('./models/User');
	User.collection.dropIndex('email_1')
		.then(() => console.log('Dropped email_1 index'))
		.catch(err => {
			if (err.code === 27) console.log('email_1 index does not exist (OK)');
			else console.error('Error dropping email index:', err.message);
		});
})
.catch(err => console.error(err));


const io = initSocket(server, { clientOrigin });


server.listen(port, () => {
console.log(`Server running on port ${port}`);
});