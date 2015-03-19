var db = require('./db'),
	mongoose = require('mongoose'),
	should = require('should');

describe('String.maxLength:', function() {
	var TestDoc;

	before('init db', db.init);
	before('load extensions', db.loadExtensions);
	before('load test model', function(done) {
		var TestDocSchema = new mongoose.Schema({
			field01: String,
			field02: {
				type: String,
				maxlength: 5
			},
			field03: {
				type: String,
				maxlength: [10, 'Invalid text length']
			},
			field04: {
				type: String,
				maxlength: [1, 'Path {PATH} ({VALUE}) has length greater than {MAX_LENGTH}']
			},
			field05: {
				type: String,
				maxlength: null
			}
		});
		TestDoc = mongoose.model('TestDoc', TestDocSchema);
		done();
	});

	it('should not impact normal string types', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field01: '12345678', field05: '12345678901234567890'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field01).be.eql('12345678');
			should(tst.field05).be.eql('12345678901234567890');
			done();
		});
	});
	it('should not throw maxLength error for shorter strings', function(done) {
		var tst = new TestDoc({field02: '1234'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field02).be.eql('1234');
			done();
		});
	});
	it('should not throw maxLength error for exact length strings', function(done) {
		var tst = new TestDoc({field02: '12345'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field02).be.eql('12345');
			done();
		});
	});
	it('should not throw maxLength error for empty values', function(done) {
		var tst = new TestDoc({field01: 'some value'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field01).be.eql('some value');
			should(tst.field02).be.not.ok;
			done();
		});
	});
	it('should throw maxLength default error message', function(done) {
		var tst = new TestDoc({field02: '123456'});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (123456) exceeds the maximum allowed length (5).'
			);
			done();
		});
	});
	it('should throw maxLength custom error message', function(done) {
		var tst = new TestDoc({
			field02: '123456',
			field03: '123456789112345'
		});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (123456) exceeds the maximum allowed length (5).'
			);
			should(err.errors.field03).be.ok;
			should(err.errors.field03.message).be.eql('Invalid text length');
			done();
		});
	});
	it('should throw maxLength custom error with special tokens replaced', function(done) {
		var tst = new TestDoc({field04: 'test'});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field04).be.ok;
			should(err.errors.field04.message).be.eql(
				'Path field04 (test) has length greater than 1'
			);
			done();
		});
	});

	after('finish db', db.finish);
});
