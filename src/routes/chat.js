const express = require('express');
const router = express.Router();
const chatController = require('../controller/chats')
const authenticateToken = require('../middlewares/authentication').authenticateToken

router.post('/create', authenticateToken, chatController.insertChat);
router.post('/getChat', authenticateToken, chatController.findChat);
router.post('/save', authenticateToken, chatController.saveChat);
router.get('/getMessages', authenticateToken, chatController.getMessages);
module.exports = router;