/**
 * check_new_charge.js
 * Author: johnnyeven
 * Time: 2014-10-14
 * Comment: 每1分钟检查新的充值记录
 */

var config = require('../config');
//var mongodb = require('../modules/db');
var dogecoin = require('node-dogecoin')({
	host: config.dogecoind.rpchost,
	port: config.dogecoind.rpcport,
	user: config.dogecoind.rpcuser,
	pass: config.dogecoind.rpcpassword
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
dogecoin.listtransactions('oldfoxlyw', function(err, trans) {
	
});
