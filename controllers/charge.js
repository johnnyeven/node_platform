module.exports = function(req, res, next) {
	if(req.session.user) {
		var config = require('../config');
		var dogecoin = require('node-dogecoin')({
			host: config.dogecoind.rpchost,
			port: config.dogecoind.rpcport,
			user: config.dogecoind.rpcuser,
			pass: config.dogecoind.rpcpassword
		});
		dogecoin.getNewAddress(req.session.user.name, function(err, addr) {
			if(err) {
				err.status = 500;
        		next(err, req, res);
        		return;
			}
			res.render('charge', {
				address: addr
			});
		});
	} else {
		res.redirect('/login');
	}
};