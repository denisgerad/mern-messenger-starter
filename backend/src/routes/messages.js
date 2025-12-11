const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { sendMessage, getMessages, deleteMessage } = require('../controllers/messageController');


router.post('/send', auth, sendMessage);
router.get('/:conversationId', auth, getMessages);
router.delete('/:id', auth, deleteMessage);


module.exports = router;