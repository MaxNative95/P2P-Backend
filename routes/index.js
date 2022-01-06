var express = require('express');
var router = express.Router();

// Controllers 
const greetingController = require('../controllers/greeting');

//Routes
router.get('/', greetingController);

module.exports = router;