const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');


module.exports = function (req, res, next) {
	// Try to get token from cookie first, then fall back to Authorization header
	let token = req.cookies?.token;
	
	if (!token) {
		const header = req.headers['authorization'];
		if (header) {
			token = header.split(' ')[1];
		}
	}
	
	if (!token) return res.status(401).json({ message: 'No token' });
	
	try {
		const payload = jwt.verify(token, jwtSecret);
		req.user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Token invalid' });
	}
};