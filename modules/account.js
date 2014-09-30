var mongodb = require('./db');

function Account(account) {
	this.name = account.name;
	this.password = account.password;
};

module.exports = Account;

Account.prototype.save = function(callback) {
	var a = {
		name: this.name,
		password: this.password
	};

	mongodb.open(function(err, db) {
		if(err) {
			return callback(err);
		}

		db.collection('account', function(err, collection) {
			if(err) {
				mongodb.close();
				return callback(err);
			}

			collection.ensureIndex('name', {unique: true});
			collection.insert(a, {safe: true}, function(err, account) {
				callback(err, account);
				//mongodb.close();
			})
		});
	});
};

Account.get = function(username, callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return  callback(err);
		}
		// 读取 users 集合
		db.collection('users', function(err, collection) {
			if (err) {
				mongodb.close();
				return  callback(err);
			}
			// 查找 name  属性为 username 的文档
			collection.findOne({name: username},  function (err, doc) {
				mongodb.close();
				if (doc) {
					//  封装文档为 User 对象
					var  user =  new  User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};