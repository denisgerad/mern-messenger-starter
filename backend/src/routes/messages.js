const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageController');


router.post('/send', auth, sendMessage);
router.get('/:conversationId', auth, getMessages);


module.exports = router;