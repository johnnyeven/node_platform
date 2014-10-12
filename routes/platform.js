var express = require('express');
var router = express.Router();

router.get('/platform', require('../controllers/platform'));
router.get('/charge', require('../controllers/charge'));

module.exports = router;