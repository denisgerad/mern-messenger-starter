const express = require('express');
const router = express.Router();
const { register, login, logout, web3Login } = require('../controllers/authController');


router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/web3-login', web3Login); // reserved for later


module.exports = router;