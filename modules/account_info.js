var mongodb = require('./db');

function AccountInfo(account, charge_address, charge_expire, charge_trans_offset) {
	this.account = account;
	this.charge_address = charge_address;
	this.charge_expire = charge_expire;
	this.charge_trans_offset = charge_trans_offset;
}

module.exports = AccountInfo;

AccountInfo.prototype.save = function(callback) {
	var thisPtr = this;
	mongodb.open(function(err, db) {
		if(err) {
			if(db) db.close();
			return callback(err, null);
		}
		var collection = db.collection('account_info');
		var data = {
			account: thisPtr.account,
			charge_address: thisPtr.charge_address,
			charge_expire: thisPtr.charge_expire,
			charge_trans_offset: thisPtr.charge_trans_offset
		};
		var param = {
			account: thisPtr.account
		};
		collection.update(param, data, {
			upsert: true,
			w: 1
		}, function(err, docs) {
			db.close();
			return callback(err, docs);
		});
	});
};

AccountInfo.get = function(params, callback) {
	mongodb.open(function(err, db) {
		if(err) {
			if(db) db.close();
			return callback(err, null);
		}
		var collection = db.collection('account_info');
		collection.findOne(params, function(err, docs) {
			db.close();
			return callback(err, docs);
		});
	});
};