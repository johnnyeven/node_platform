var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

router.post('/login/process', require('../controllers/login'));
router.post('/register/process', require('../controllers/register'));

module.exports = router;
