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
    jsDir: '/assets/js',
    cssDir: '/assets/css',
}

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
    .pipe( gulp.dest( config.dist + config.cssDir + '/css' ) )
    .pipe( cssnano({
    discardComments: { removeAll: true }
    }) )
    .pipe( rename({ suffix: '.min' }) )
    .pipe( gulp.dest( config.dist + config.cssDir + '/css' ) );
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
    .pipe( gulp.dest( config.dist + '/languages' ) )
} );


//Convert readme.txt to Markdown for Github
gulp.task('readme', function() {
  gulp.src( config.src + '/readme.txt' )
    .pipe( readme() )
    .pipe( gulp.dest( config.dist ) );
});

// Build.
gulp.task( 'default', ['translate', 'js', 'css', 'readme'] );
