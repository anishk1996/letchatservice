const express = require('express');
const router = express.Router();
const userController = require('../controller/users')

router.post('', userController.signup);

module.exports = router;