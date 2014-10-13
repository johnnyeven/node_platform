module.exports = function(req, res, next) {
	if(req.session.user) {
		var config = require('../config');
		var dogecoin = require('node-dogecoin')({
			host: config.dogecoind.rpchost,
			port: config.dogecoind.rpcport,
			user: config.dogecoind.rpcuser,
			pass: config.dogecoind.rpcpassword
		});
		var mongodb = require('../modules/db');
		var AccountInfo = require('../modules/account_info');
		var param = {
			account: req.session.user.name
		};
		AccountInfo.get(param, function(err, docs) {
			if(!err) {
				if(docs.length > 0) {
					var info = docs[0];
					if(info.charge_expire) {
						dogecoin.getNewAddress(req.session.user.name, function(err, addr) {
							if(err) {
								err.status = 500;
				        		next(err, req, res);
				        		return;
							}
							var account = new AccountInfo(
								req.session.user,
								addr,
								0
							);
							account.save(function(err, docs) {
								if(!err) {
									res.render('charge', {
										address: addr
									});
								} else {
									err.status = 500;
									next(err, req, res);
								}
							});
						});
					}
				} else {
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
				}
			}
		});
	} else {
		res.redirect('/login');
	}
};