var mongodb = require('./db');

function AccountInfo(account, charge_address, charge_expire) {
	this.account = account;
	this.charge_address = charge_address;
	this.charge_expire = charge_expire;
}

module.exports = AccountInfo;

AccountInfo.prototype.save = function(callback) {
	var collection = db.collection('account_info');
	var data = {
		account: this.account,
		charge_address: this.charge_address,
		charge_expire: this.charge_expire
	};
	var param = {
		account: this.account
	};
	collection.update(param, data, {
		upsert: true,
		w: 1
	}, function(err, docs) {
		return callback(err, docs);
	});
};

AccountInfo.get = function(params, callback) {
	var collection = db.collection('account_charge_address');
	collection.find(params).toArray(function(err, docs) {
		return callback(err, docs);
	});
};