var gulp     = require( 'gulp' ),
    uglify   = require( 'gulp-uglify' ),
    cssnano  = require( 'gulp-cssnano' ),
    wpPot    = require( 'gulp-wp-pot' ),
    jshint   = require( 'gulp-jshint' ),
    rename   = require( 'gulp-rename' ),
    sort     = require( 'gulp-sort' ),
    readme   = require( 'gulp-readme-to-markdown' );

// Configs.
var config = {
    src:  '.',
    dist: '.',
}

// Run JSHint & Minify Assets.
gulp.task( 'js', function(  ) {
  return gulp.src([ 
    '!' + config.src + '/admin/js/**/*.min.js',
    config.src + '/admin/js/**/*.js' ])
    .pipe( jshint() )
    .pipe( jshint.reporter( 'jshint-stylish' ) )
    .pipe( jshint.reporter( 'fail' ) )
    .pipe( gulp.dest( config.dist + '/admin/js' ) )
    .pipe( uglify() )
    .pipe( rename({
      suffix: '.min'
    }) )
    .pipe( gulp.dest( config.dist + '/admin/js' ) );
});

// Minify CSS Assets.
gulp.task( 'css', function(  ) {
  return gulp.src([ 
    '!' + config.src + '/admin/css/**/*.min.css',
    config.src + '/admin/css/**/*.css' ])
    .pipe( gulp.dest( config.dist + '/admin/css' ) )
    .pipe( cssnano({
<<<<<<< HEAD
    discardComments: { removeAll: true }
=======
		discardComments: { removeAll: true }
>>>>>>> dev
    }) )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest( config.dist + '/admin/css' ) );
});

// Setup Translations.
gulp.task( 'translate', function (  ) {
  return gulp.src( config.src + '/**/*.php' )
    .pipe( sort() )
    .pipe( wpPot({
      domain: '$this->plugin_name',
      destFile: 'boldgrid-seo.pot',
      package: 'boldgrid_theme_framework',
      bugReport: 'https://boldgrid.com',
      team: 'The BoldGrid Team <support@boldgrid.com>'
    }) )
    .pipe( gulp.dest( config.dist + '/languages' ) )
} );


//Convert readme.txt to Markdown for Github
gulp.task('readme', function() {
<<<<<<< HEAD
  gulp.src( config.src + '/readme.txt' )
    .pipe( readme() )
    .pipe( gulp.dest( config.dist ) );
=======
	gulp.src( config.src + '/readme.txt' )
		.pipe( readme() )
		.pipe( gulp.dest( config.dist ) );
>>>>>>> dev
});

// Build.
gulp.task( 'default', ['translate', 'js', 'css', 'readme'] );
