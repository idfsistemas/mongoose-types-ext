var path = require('path'),
	fs = require('fs'),
	gulp = require('gulp'),
	jshintReporter = require('jshint-stylish'),
	pkg = require(path.join(__dirname, 'package.json')),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var filePatterns = {
	src: ['./lib/**/*.js', './index.js'],
	test: ['./test/**/*.test.js']
};

var config = {
	files: filePatterns.test,
	reporter: 'spec',

	target: 'node',
	framework: 'mocha',
	coverage: filePatterns.src
};

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

function mochaRunnerFactory(reporter) {
	return plugins.mocha({
		reporter: reporter || config.reporter
	});
}

function unitTestFactory(watch) {
	function mochaRunner() {
		return gulp.src(config.files, {
			cwd: process.env.PWD,
			read: false
		})
		.pipe(mochaRunnerFactory(config.reporter))
		.on('error', handleError);
	}

	if (!watch) {
		return mochaRunner;
	}

	var filesToWatch = config.coverage.concat(config.files);

	return function() {
		gulp.watch(filesToWatch, mochaRunner);
	};
}

gulp.task('jshint', function() {
	gulp.src(config.coverage.concat(config.files))
	.pipe(plugins.jshint('.jshintrc'))
	.pipe(plugins.jshint.reporter(jshintReporter));
});

gulp.task('default', ['jshint'], function() {
	gulp.watch(config.files.concat(config.coverage), ['jshint']);
});

gulp.task('test', ['jshint'], function(done) {
	unitTestFactory(false)();
});

gulp.task('test-watch', function(done) {
	unitTestFactory(true)();
});

gulp.task('test-coverage', function(done) {
	gulp.src(config.coverage)
	.pipe(plugins.istanbul())
	.pipe(plugins.istanbul.hookRequire())
	.on('finish', function() {
		gulp.src(config.files, {
			cwd: process.env.PWD,
			read: false
		})
		.pipe(mochaRunnerFactory('progress'))
		.pipe(plugins.istanbul.writeReports())
		.on('end', done);
	});
});

gulp.task('changelog', function(done) {
	var changelog = require('conventional-changelog');

	var options = {
		repository: pkg.homepage,
		version: pkg.version,
		file: path.join(__dirname, 'CHANGELOG.md')
	};

	changelog(options, function(err, log) {
		if (err) {
			throw err;
		}

		fs.writeFile(options.file, log, done);
	});
});
