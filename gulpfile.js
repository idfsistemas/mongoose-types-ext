var gulp = require('gulp'),
	path = require('path'),
	jshintReporter = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	}),
	istanbul = require('gulp-istanbul');

var filePatterns = {
	src: ['./lib/**/*.js', './index.js'],
	test: ['./test/**/*.test.js']
};

var config = {
	files: filePatterns.test,
	reporter: 'progress',

	target: 'node',
	framework: 'mocha',
	coverage: filePatterns.src
};

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

function mochaRunnerFactory() {
	var mocha = require('gulp-mocha');

	return mocha({
		reporter: config.reporter || 'progress'
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
	config.reporter = 'spec';
	unitTestFactory(true)();
});

gulp.task('test-coverage', function(done) {
	gulp.src(config.coverage)
	.pipe(istanbul())
	.pipe(istanbul.hookRequire())
	.on('finish', function() {
		gulp.src(config.files, {
			cwd: process.env.PWD,
			read: false
		})
		.pipe(mochaRunnerFactory('progress'))
		.pipe(istanbul.writeReports())
		.on('end', done);
	});
});
