module.exports = function(req, res, next) {
	if(req.session.user) {
		var config = require('../config');
		var dogecoin = require('node-dogecoin')({
			host: config.dogecoind.rpchost,
			port: config.dogecoind.rpcport,
			user: config.dogecoind.rpcuser,
			pass: config.dogecoind.rpcpassword
		});
		dogecoin.getDifficulty(function(err, diff) {
			if(err) {
				err.status = 500;
        		next(err, req, res);
        		return;
			}
		    console.log(diff);
			res.render('platform', {});
		});
	} else {
		res.redirect('/login');
	}
};