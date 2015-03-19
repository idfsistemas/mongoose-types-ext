var db = require('./db'),
	mongoose = require('mongoose'),
	should = require('should');

describe('String.minLength:', function() {
	var TestDoc;

	before('init db', db.init);
	before('load extensions', db.loadExtensions);
	before('load test model', function(done) {
		var TestDocSchema = new mongoose.Schema({
			field01: String,
			field02: {
				type: String,
				minlength: 5
			},
			field03: {
				type: String,
				minlength: [10, 'Invalid text length']
			},
			field04: {
				type: String,
				minlength: [10, 'Path {PATH} ({VALUE}) has length smaller than {MIN_LENGTH}']
			}
		});
		TestDoc = mongoose.model('TestDoc', TestDocSchema);
		done();
	});

	it('should not impact normal string types', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field01: '12345678'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field01).be.eql('12345678');
			done();
		});
	});
	it('should not throw minLength error for bigger strings', function(done) {
		var tst = new TestDoc({field02: '123456'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field02).be.eql('123456');
			done();
		});
	});
	it('should not throw minLength error for exact length strings', function(done) {
		var tst = new TestDoc({field02: '12345'});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field02).be.eql('12345');
			done();
		});
	});
	it('should not throw minLength error for empty values', function(done) {
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
	it('should throw minLength default error message', function(done) {
		var tst = new TestDoc({field02: '123'});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (123) exceeds the minimum allowed length (5).'
			);
			done();
		});
	});
	it('should throw minLength error for empty strings', function(done) {
		var tst = new TestDoc({field02: ''});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` () exceeds the minimum allowed length (5).'
			);
			done();
		});
	});
	it('should throw minLength custom error message', function(done) {
		var tst = new TestDoc({
			field02: '123',
			field03: '12345'
		});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (123) exceeds the minimum allowed length (5).'
			);
			should(err.errors.field03).be.ok;
			should(err.errors.field03.message).be.eql('Invalid text length');
			done();
		});
	});
	it('should throw minLength custom error with special tokens replaced', function(done) {
		var tst = new TestDoc({field04: 'test'});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field04).be.ok;
			should(err.errors.field04.message).be.eql(
				'Path field04 (test) has length smaller than 10'
			);
			done();
		});
	});

	after('finish db', db.finish);
});
