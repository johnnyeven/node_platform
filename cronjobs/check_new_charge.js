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
	var aInfo = new AccountInfo({
		account: "test",
	});
	aInfo.save(function(err, doc, numberAffected) {
		if(err) return console.error(err.message);
		console.log(doc);
		db.close();
	});
});

/*
* trans(Array) construct:
* account
* address
* category
* amount
* confirmations
* blockhash
* blockindex
* blocktime
* txid
* walletconflicts
* time
* timereceived
*/
/*
mongodb.open(function(err, db) {
	var param = {
		account: 'oldfoxlyw'
	};
	db.findOne(param, function(err, doc) {
		dogecoin.listtransactions('oldfoxlyw', 50, doc.charge_trans_offset, function(err, trans) {

		});
	});
});
*/