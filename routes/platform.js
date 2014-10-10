var express = require('express');
var router = express.Router();

router.get('/platform', require('../controllers/platform'));

module.exports = router;