var MySQL = require('mysql');

var data = {
	create: function(sql) {
		return MySQL.createConnection(sql);
	},
	connect: function(connection, error) {
		connection.connect(function(err) {
			if (err) {
				console.warn('db connect error: ' + err);

				setTimeout(function() {
					this.connect(connection, error);
				},
				2000);
			}
		});

		connection.on('error',
		function(err) {
			console.warn('db error (reConnect late): ' + err);
			if (err.code === 'PROTOCOL_CONNECTION_LOST') {
				this.connect(connection, error);
			}
		});
	},
	end: function(connection) {
		connection.end();
	},
	query: function(connection, sqlstr, ok, fail) {
		connection.query(sqlstr,
		function(err, rows, fields) {
			if (err) {
				console.log('db error: ' + err);
				fail(err);
			} else {
				ok(rows);
			}
		});
	}
};

module.exports = data;
