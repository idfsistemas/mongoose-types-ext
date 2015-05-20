module.exports = function(mongoose) {
	require('./lib/string-ext/exact-length.js')(mongoose);
	require('./lib/number-ext/exclusive-min.js')(mongoose);
};
