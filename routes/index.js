var express = require('express');
var router = express.Router();

// Controllers 
const greetingController = require('../controllers/greeting');
const userController = require('../controllers/user');

//Routes
router.get('/', greetingController);
router.post('/user', userController);

module.exports = router;