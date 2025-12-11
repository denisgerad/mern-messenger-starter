const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');


module.exports = function (req, res, next) {
const header = req.headers['authorization'];
if (!header) return res.status(401).json({ message: 'No token' });
const token = header.split(' ')[1];
if (!token) return res.status(401).json({ message: 'Invalid token' });
try {
const payload = jwt.verify(token, jwtSecret);
req.user = payload;
next();
} catch (err) {
return res.status(401).json({ message: 'Token invalid' });
}
};