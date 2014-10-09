var express = require('express');
var router = express.Router();

router.get('/dogecoin', require('../controllers/dogecoin'));

module.exports = router;