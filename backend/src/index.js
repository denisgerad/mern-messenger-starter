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

const corsOptions = {
	origin: function(origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(null, false);
		}
	},
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
	exposedHeaders: ['Set-Cookie'],
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint for cron jobs (e.g., ping from Render)
app.get('/cron/health', (req, res) => {
	res.status(200).send('Cron job OK');
});


mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Mongo connected'))
.catch(err => console.error(err));


const io = initSocket(server, { clientOrigin });


server.listen(port, () => {
console.log(`Server running on port ${port}`);
});