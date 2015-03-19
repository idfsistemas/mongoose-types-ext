var mongoose = require('mongoose');

module.exports = {
	init: function(done) {
		mongoose.models = {};
		if (mongoose.connection.readyState) {
			return done();
		}
		mongoose.connect('mongodb://localhost/mongoose-types-ext-db', done);
	},
	finish: function(done) {
		mongoose.connection.db.dropDatabase();
		mongoose.connection.close(done);
	},
	loadExtensions: function(done) {
		require('../index.js')(mongoose);
		done();
	}
};
