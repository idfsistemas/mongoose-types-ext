module.exports = function(mongoose) {
	require('./lib/string-ext/max-length.js')(mongoose);
	require('./lib/string-ext/min-length.js')(mongoose);
};
