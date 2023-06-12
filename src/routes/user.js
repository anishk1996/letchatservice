const express = require('express');
const router = express.Router();
const userController = require('../controller/users')
const authenticateToken = require('../middlewares/authentication').authenticateToken
router.get('/list', authenticateToken, userController.usersList);

module.exports = router;