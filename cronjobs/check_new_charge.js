/**
 * check_new_charge.js
 * Author: johnnyeven
 * Time: 2014-10-14
 * Comment: 每1分钟检查新的充值记录
 */

var config = require('../config');
var mongoose = require('mongoose');
var dogecoin = require('node-dogecoin')({
	host: config.dogecoind.rpchost,
	port: config.dogecoind.rpcport,
	user: config.dogecoind.rpcuser,
	pass: config.dogecoind.rpcpassword
});
mongoose.connect('mongodb://' + config.host + '/' + config.db);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	var AccountInfo = require('../modules/AccountInfo');
	var AssetsLog = require('../modules/AssetsLog');
	var userName = 'oldfoxlyw';
	AccountInfo.findOne({
		account: userName
	}).exec(function(err, doc) {
		dogecoin.listtransactions(userName, 50, doc.dogecoin.charge_trans_offset, function(err, trans) {
			var length = trans.length;
			if(length > 0) {
				for(var i in trans) {
					if(trans[i].category == 'receive' && trans[i].confirmations >= 6) {
						doc.dogecoin.amount += trans[i].amount;
						var assetLog = new AssetsLog({
							account: userName,
							category: 1,
							type: 1,
							address: trans[i].address,
							amount: trans[i].amount,
							time: trans[i].time
						});
						assetLog.save(function(err, doc, numberAffected) {
							if(!err) {
								console.log(trans[i]);
							}
						});
					}
				}
				doc.dogecoin.charge_trans_offset += length;
				AccountInfo.update({
					account: userName
				}, {
					dogecoin: {
						amount: doc.dogecoin.amount,
						charge_address: doc.dogecoin.charge_address,
						charge_expire: doc.dogecoin.charge_expire,
						charge_trans_offset: doc.dogecoin.charge_trans_offset
					}
				}, function(err, numberAffected) {
					console.log(numberAffected);
					db.close();
				});
			} else {
				db.close();
			}
		});
	});
});