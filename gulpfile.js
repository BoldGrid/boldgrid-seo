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
    // Files to remove.
    var files = [
        config.src + config.bowerDir + '/butterbean/.git',
        config.src + config.bowerDir + '/text-statistics/.git',
        config.src + config.bowerDir + '/text-statistics/test',
        config.src + config.bowerDir + '/text-statistics/.gitignore',
    ];
  git.clone( 'https://github.com/justintadlock/butterbean', { args: '-b dev --single-branch ' + config.src + config.bowerDir + '/butterbean' }, function( err ) {
    // silent
  });
  git.clone( 'https://github.com/cgiffard/TextStatistics.js', { args: config.src + config.bowerDir + '/text-statistics' }, function( err ) {
    // silent
  });
  files.forEach( function( file ) {
    del( file );
  });
});

// Copy lib files into repo.
gulp.task( 'copyLibs', ['clone'], function() {
  gulp.src( config.src + config.bowerDir + '/butterbean/**/*' )
    .pipe( gulp.dest( config.dist + '/includes/lib/butterbean' ) );
  gulp.src( config.src + config.bowerDir + '/text-statistics/**/*.{js,md}' )
      .pipe( gulp.dest( config.dist + '/assets/js/text-statistics' ) );
});

// Build.
gulp.task( 'default', ['translate', 'js', 'css', 'readme', 'clone', 'copyLibs' ] );
