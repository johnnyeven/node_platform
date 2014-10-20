module.exports = function(req, res, next) {
	var getAndSaveNewAddress = function(username, aInfo) {
		dogecoin.getNewAddress(username, function(err, addr) {
			if(err) {
				err.status = 500;
				next(err, req, res);
				return;
			}
			if(aInfo) {
				AccountInfo.update({
					account: username
				}, {
					dogecoin: {
						amount: aInfo.dogecoin.amount
						charge_address: aInfo.dogecoin.charge_address,
						charge_expire: aInfo.dogecoin.charge_expire,
						charge_trans_offset: aInfo.dogecoin.charge_trans_offset
					}
				}, function(err, numberAffected) {
					db.close();
					res.render('charge', {
						address: addr
					});
				});
			} else {
				var currentTime = Math.floor((new Date()).getTime() / 1000);
				aInfo = new AccountInfo({
					account: req.session.user.name,
					dogecoin: {
						amount: 0,
						charge_address: addr,
						charge_expire: currentTime + 1800,
						charge_trans_offset: 0
					}
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
			account: req.session.user.name
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
						if(doc.dogecoin.charge_expire >= currentTime) {
							db.close();
							res.render('charge', {
								address: doc.dogecoin.charge_address
							});
						} else {
							doc.dogecoin.charge_expire = currentTime + 1800;
							getAndSaveNewAddress(doc.account, doc);
						}
					} else {
						getAndSaveNewAddress(req.session.user.name, null);
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