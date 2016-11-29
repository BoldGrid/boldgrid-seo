var gulp     = require( 'gulp' ),
    del      = require( 'del' ),
    bower    = require( 'gulp-bower' ),
    rename   = require( 'gulp-rename' ),
    sort     = require( 'gulp-sort' ),
    uglify   = require( 'gulp-uglify' ),
    cssnano  = require( 'gulp-cssnano' ),
    wpPot    = require( 'gulp-wp-pot' ),
    jshint   = require( 'gulp-jshint' ),
    concat   = require( 'gulp-concat' ),
    pump     = require( 'pump' ),
    sequence = require( 'run-sequence' ),
    readme   = require( 'gulp-readme-to-markdown' ),
    jasmine  = require( 'gulp-jasmine' ),
    server   = require( 'karma' ).Server;

// Configs.
var config = {
    src:  '.',
    dist: '.',
    jsDir: '/assets/js',
    cssDir: '/assets/css',
    bowerDir: '/bower_components',
};

// Run JSHint & Minify Assets.
gulp.task( 'js', function ( cb ) {
	pump( [
		gulp.src( [
			config.src + config.jsDir + '/bgseo/boldgrid-seo.js',
			config.src + config.jsDir + '/control/*.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-util.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-words.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-wordcount.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-admin.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-tinymce.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-content-analysis.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-!(util|admin|tinymce|content-analysis|init|words|wordcount).js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-init.js',
		] ),
		//jshint.reporter( 'fail' ),
		concat( 'bgseo.js' ),
		gulp.dest( config.dist + config.jsDir ),
		uglify(),
		rename( {
			suffix: '.min'
		} ),
		gulp.dest(  config.dist + config.jsDir )
	], cb );
});

// Minify CSS Assets.
gulp.task( 'css', function() {
	return gulp.src([
	'!' + config.src + config.cssDir + '/**/*.min.css',
	config.src + config.cssDir + '/**/*.css' ])
		.pipe( gulp.dest( config.dist + config.cssDir ) )
		.pipe( cssnano({
			discardComments: { removeAll: true }
		}) )
		.pipe( rename({ suffix: '.min' }) )
		.pipe( gulp.dest( config.dist + config.cssDir ) );
});

// Setup Translations.
gulp.task( 'translate', function () {
	return gulp.src( config.src + '/**/*.php' )
		.pipe( sort() )
		.pipe( wpPot({
			domain: 'bgseo',
			destFile: 'bgseo.pot',
			package: 'bgseo',
			bugReport: 'https://boldgrid.com',
			team: 'The BoldGrid Team <support@boldgrid.com>'
		}) )
		.pipe( gulp.dest( config.dist + '/languages' ) );
});


//Convert readme.txt to Markdown for Github
gulp.task('readme', function() {
	return gulp.src( config.src + '/readme.txt' )
		.pipe( readme() )
		.pipe( gulp.dest( config.dist ) );
});

// Copy Butterbean dep.
gulp.task( 'copyButterbean', function() {
	return gulp.src([
		'!' + config.src + config.bowerDir + '/butterbean/.git',
		config.src + config.bowerDir + '/butterbean/**/*',
		])
		.pipe( gulp.dest( config.dist + '/includes/lib/butterbean' ) );


});

// Copy TextStatistics dep.
gulp.task( 'copyTextStatistics', function() {
	return gulp.src([
		'!' + config.src + config.bowerDir + '/TextStatistics.js/test/**/*',
		config.src + config.bowerDir + '/TextStatistics.js/**/*.{js,md}',
		])
		.pipe( gulp.dest( config.dist + '/assets/js/text-statistics' ) );
});

// JS Unit testing
gulp.task( 'jsTest', function (done) {
	return new server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done ).start();
});

// Build.
gulp.task( 'cleanDeps', function() {
	return del([
		config.src + config.bowerDir + '/butterbean',
		config.src + config.bowerDir + '/text-statistics',

	]);
});

// Create a bower task to retrieve bower_components on build
gulp.task( 'bower', function(  ) {
	return bower().pipe( gulp.dest( config.src + config.bowerDir ) );
} );

// Build.
gulp.task( 'default', function( cb ) {
	sequence(
		'cleanDeps',
		'bower',
		[ 'jsTest', 'translate', 'js', 'css', 'readme', 'copyButterbean', 'copyTextStatistics' ],
		cb
	);
});
