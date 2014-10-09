module.exports = function(req, res) {
	var dogecoin = require('node-dogecoin')();
	dogecoin.auth('myusername', 'mypassword');
	dogecoin.getDifficulty(function() {
	    console.log(arguments);
	})
	res.render('dogecoin', {});
};