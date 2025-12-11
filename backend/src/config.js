const fs = require('fs');
const dotenv = require('dotenv');

let envPath = '.env';
if (fs.existsSync('.env.local')) envPath = '.env.local';
dotenv.config({ path: envPath });

module.exports = {
	port: process.env.PORT || 5000,
	mongoUri: process.env.MONGO_URI,
	jwtSecret: process.env.JWT_SECRET,
	clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
};