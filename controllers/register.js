var Account = require('../modules/account');
var crypto = require('crypto');

module.exports = function(req, res) {
	var input = req.body;
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	var newAccount = new Account({
		name: req.body.username,
		password: password
	});

	Account.get(newAccount.username, function(err, account) {
		if(account) {
			err = 'Username already exist.';
		}
		if(err) {
			//req.flash('error', err);
			return res.redirect('/register');
		}

		newAccount.save(function(err) {
			if(err) {
				//req.flash('error', err);
				return res.redirect('/register');
			}
			//req.flash('success', 'Register success!');
			res.redirect('/');
		});
	});
};