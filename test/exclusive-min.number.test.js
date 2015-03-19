var db = require('./db'),
	mongoose = require('mongoose'),
	should = require('should');

describe('Number.exclusiveMin:', function() {
	var TestDoc;

	before('init db', db.init);
	before('load extensions', db.loadExtensions);
	before('load test model', function(done) {
		var TestDocSchema = new mongoose.Schema({
			field01: Number,
			field02: {
				type: Number,
				exclusivemin: 5
			},
			field03: {
				type: Number,
				exclusivemin: [10, 'Invalid number value']
			},
			field04: {
				type: Number,
				exclusivemin: [20, 'Path {PATH} ({VALUE}) out of minimum limit {EXCLUSIVE_MIN}']
			},
			field05: {
				type: Number,
				exclusivemin: null
			}
		});
		TestDoc = mongoose.model('TestDoc', TestDocSchema);
		done();
	});

	it('should not impact normal Number types', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field01: 1, field05: -1});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field01).be.eql(1);
			should(tst.field05).be.eql(-1);
			done();
		});
	});
	it('should not throw exclusiveMin error for bigger number', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field02: 5.0009});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field02).be.eql(5.0009);
			done();
		});
	});
	it('should not throw exclusiveMin error for empty values', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field01: 1});
		tst.save(function(err, tst) {
			if(err) {
				return done(err);
			}
			should(tst.field01).be.eql(1);
			should(tst.field02).be.not.ok;
			done();
		});
	});

	it('should throw exclusiveMin default error message', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field02: 1});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (1) should be greater than 5.'
			);
			done();
		});
	});
	it('should throw exclusiveMin error for exact value', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field02: 5});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (5) should be greater than 5.'
			);
			done();
		});
	});
	it('should throw exclusiveMin custom error message', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({
			field02: 1,
			field03: 9
		});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field02).be.ok;
			should(err.errors.field02.message).be.eql(
				'Path `field02` (1) should be greater than 5.'
			);
			should(err.errors.field03).be.ok;
			should(err.errors.field03.message).be.eql('Invalid number value');
			done();
		});
	});
	it('should throw exclusiveMin custom error with special tokens replaced', function(done) {
		this.timeout(5000);
		var tst = new TestDoc({field04: 15});
		tst.save(function(err) {
			should(err).be.ok;
			should(err.message).be.eql('Validation failed');
			should(err.name).be.eql('ValidationError');
			should(err.errors.field04).be.ok;
			should(err.errors.field04.message).be.eql(
				'Path field04 (15) out of minimum limit 20'
			);
			done();
		});
	});

	after('finish db', db.finish);
});
