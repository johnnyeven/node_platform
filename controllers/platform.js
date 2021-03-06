module.exports = function(req, res, next) {
	if(req.session.user) {
		var config = require('../config');
		var dogecoin = require('node-dogecoin')({
			host: config.dogecoind.rpchost,
			port: config.dogecoind.rpcport,
			user: config.dogecoind.rpcuser,
			pass: config.dogecoind.rpcpassword
		});
		dogecoin.getBalance(function(err, b) {
			if(err) {
				err.status = 500;
        		next(err, req, res);
        		return;
			}
			res.render('platform', {});
		});
	} else {
		res.redirect('/login');
	}
};