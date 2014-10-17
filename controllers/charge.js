module.exports = function(req, res, next) {
	var getAndSaveNewAddress = function(aInfo) {
		dogecoin.getNewAddress(username, function(err, addr) {
			if(err) {
				err.status = 500;
				next(err, req, res);
				return;
			}
			if(aInfo) {
				aInfo.update(function(err, doc, numberAffected) {
					db.close();
				});
				res.render('charge', {
					address: addr
				});
			} else {
				aInfo = new AccountInfo({
					account: req.session.user.name,
					charge_address: addr,
					charge_expire: currentTime + 1800,
					charge_trans_offset: 0
				});
				aInfo.save(function(err, doc, numberAffected) {
					db.close();
					if(!err) {
						res.render('charge', {
							address: addr
						});
					} else {
						err.status = 500;
						next(err, req, res);
					}
				});
			}
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
		var AccountInfo = require('../modules/AccountInfo');
		var param = {
			'account': req.session.user.name
		};
		var mongoose = require('mongoose');
		mongoose.connect('mongodb://' + config.host + '/' + config.db);
		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
			AccountInfo.findOne(param, function(err, doc) {
				if(!err) {
					var currentTime = Math.floor((new Date()).getTime() / 1000);
					if(doc) {
						if(doc.charge_expire >= currentTime + 1800) {
							doc.charge_expire = currentTime + 1800;
							getAndSaveNewAddress(doc);
						} else {
							db.close();
							res.render('charge', {
								address: doc.charge_address
							});
						}
					} else {
						getAndSaveNewAddress(null);
					}
				} else {
					err.status = 500;
					next(err, req, res);
					return;
				}
			});
		});
	} else {
		res.redirect('/login');
	}
};