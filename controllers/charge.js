module.exports = function(req, res, next) {
	var getAndSaveNewAddress = function(username, expire) {
		dogecoin.getNewAddress(username, function(err, addr) {
			if(err) {
				err.status = 500;
				next(err, req, res);
				return;
			}
			var account = new AccountInfo(
				username,
				addr,
				expire
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
	};
	
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
		AccountInfo.get(param, function(err, doc) {
			if(!err) {
				var currentTime = Math.floor((new Date()).getTime() / 1000);
				if(doc) {
					if(doc.charge_expire >= currentTime + 1800) {
						getAndSaveNewAddress(req.session.user.name, currentTime + 1800);
					} else {
						res.render('charge', {
							address: doc.charge_address
						});
					}
				} else {
					getAndSaveNewAddress(req.session.user.name, currentTime + 1800);
				}
			} else {
				err.status = 500;
				next(err, req, res);
				return;
			}
		});
	} else {
		res.redirect('/login');
	}
};