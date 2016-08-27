var gulp     = require( 'gulp' ),
    uglify   = require( 'gulp-uglify' ),
    cssnano  = require( 'gulp-cssnano' ),
    wpPot    = require( 'gulp-wp-pot' ),
    jshint   = require( 'gulp-jshint' ),
    rename   = require( 'gulp-rename' ),
    sort     = require( 'gulp-sort' ),
	git      = require( 'gulp-git' ),
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
gulp.task( 'js', function(  ) {
  return gulp.src([
    '!' + config.src + config.jsDir + '/**/*.min.js',
    config.src + config.jsDir + '/**/*.js' ])
    .pipe( jshint() )
    .pipe( jshint.reporter( 'jshint-stylish' ) )
    .pipe( jshint.reporter( 'fail' ) )
    .pipe( gulp.dest( config.dist + config.jsDir ) )
    .pipe( uglify() )
    .pipe( rename({
      suffix: '.min'
    }) )
    .pipe( gulp.dest( config.dist + config.jsDir ) );
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
      domain: 'boldgrid-seo',
      destFile: 'boldgrid-seo.pot',
      package: 'boldgrid_seo',
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
  git.clone( 'https://github.com/justintadlock/butterbean', { args: config.src + '/includes/lib/butterbean' }, function( err ) {
    // silent
  });
});

//Convert readme.txt to Markdown for Github
gulp.task('bower', function() {
  gulp.src( './bower_components/selectize/dist/js/standalone/**/*.js' )
  	.pipe( gulp.dest( config.dist + '/assets/js') );
  gulp.src( './bower_components/selectize/dist/css/**/*.css' )
  	  .pipe( gulp.dest( config.dist + '/assets/css' ) );
});

// Build.
gulp.task( 'default', ['bower', 'translate', 'js', 'css', 'readme', 'clone'] );
