var mongodb = require('./db');

function AccountChargeAddress(account, address, expire) {
	this.account = account;
	this.address = address;
	this.expire = expire;
}

module.exports = AccountChargeAddress;

AccountChargeAddress.prototype.save = function(callback) {
	var collection = db.collection('account_charge_address');
	var data = {
		account: this.account,
		address: this.address,
		expire: this.expire
	};
	var param = {
		account: this.account
	};
	collection.find(param).toArray(function(err, docs) {
		if(docs.length > 0) {

		} else {
			collection.insert(data, function(err, doc) {
				if(err) {
					callback(err, null);
				}
			});
		}
	});
};