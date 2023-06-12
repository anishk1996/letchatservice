const express = require('express');
const router = express.Router();
const userController = require('../controller/users')

router.post('', userController.login);

module.exports = router;