module.exports = function(req, res) {
	var input = req.body;
	var md5 = crypto.createHash('md5');
	var password = md5.update(input.password).digest('hex').toUpperCase();

	var account = new Account({
		name: input.username,
		pass: password
	});

	account.validate(function(err, acc) {
		if(err || !acc) {

		} else {
			
		}
	});
};