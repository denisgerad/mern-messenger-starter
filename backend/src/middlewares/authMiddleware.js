const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');


module.exports = function (req, res, next) {
\t// Try to get token from cookie first, then fall back to Authorization header
\tlet token = req.cookies?.token;
\t
\tif (!token) {
\t\tconst header = req.headers['authorization'];
\t\tif (header) {
\t\t\ttoken = header.split(' ')[1];
\t\t}
\t}
\t
\tif (!token) return res.status(401).json({ message: 'No token' });
\t
\ttry {
\t\tconst payload = jwt.verify(token, jwtSecret);
\t\treq.user = payload;
\t\tnext();
\t} catch (err) {
\t\treturn res.status(401).json({ message: 'Token invalid' });
\t}
};