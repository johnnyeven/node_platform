var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res) {
	res.render('login', {});
});
router.get('/register', function(req, res) {
	res.render('register', {});
});
router.post('/login', require('../controllers/login'));
router.post('/register', require('../controllers/register'));

module.exports = router;
