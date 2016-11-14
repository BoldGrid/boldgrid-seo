var gulp     = require( 'gulp' ),
    uglify   = require( 'gulp-uglify' ),
    cssnano  = require( 'gulp-cssnano' ),
    wpPot    = require( 'gulp-wp-pot' ),
    jshint   = require( 'gulp-jshint' ),
    rename   = require( 'gulp-rename' ),
    sort     = require( 'gulp-sort' ),
    git      = require( 'gulp-git' ),
    concat   = require( 'gulp-concat' ),
    pump     = require( 'pump' ),
    del      = require( 'del' ),
    readme   = require( 'gulp-readme-to-markdown' );

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
			config.src + config.jsDir + '/control/*.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-admin.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-tinymce.js',
			config.src + config.jsDir + '/bgseo/boldgrid-seo-content-analysis.js',
			config.src + config.jsDir + '/bgseo/*!(admin|tinymce|content-analysis).js'
		] ),
		//jshint.reporter( 'fail' ),
		concat( 'bgseo.js' ),
		gulp.dest( config.dist + config.jsDir ),
		uglify(),
		rename( {
			suffix: '.min'
		} ),
		gulp.dest(  config.dist + config.jsDir )
    ],
    cb
  );
});

// Minify CSS Assets.
gulp.task( 'css', function(  ) {
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
gulp.task( 'translate', function (  ) {
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
} );


//Convert readme.txt to Markdown for Github
gulp.task('readme', function() {
  gulp.src( config.src + '/readme.txt' )
    .pipe( readme() )
    .pipe( gulp.dest( config.dist ) );
});

// Clone remote repo to sub folder ($CWD/sub/folder/git-test)
gulp.task( 'clone', function() {
  git.clone( 'https://github.com/justintadlock/butterbean', { args: '-b dev --single-branch ' + config.src + '/includes/lib/butterbean' }, function( err ) {
    // silent
  });
  git.clone( 'https://github.com/cgiffard/TextStatistics.js', { args: config.src + '/assets/js/text-statistics' }, function( err ) {
    // silent
  });
  var files = [
      config.src + '/includes/lib/butterbean/.git',
      config.src + '/assets/js/text-statistics/.git',
      config.src + '/assets/js/text-statistics/test',
      config.src + '/assets/js/text-statistics/.gitignore',
  ];
  files.forEach( function( file ) {
    del( file );
  });
});

// Build.
gulp.task( 'default', ['translate', 'js', 'css', 'readme', 'clone' ] );
