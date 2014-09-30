var config = require('../config');
var db = require('mongodb').Db;
var connection = require('mongodb').Connection;
var server = require('mongodb').Server;

module.exports = new db(config.db, new server(config.host, connection.DEFAULT_PORT, {}));