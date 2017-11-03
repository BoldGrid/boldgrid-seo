module.exports = function( config ) {
	config.set({
		frameworks: ['jasmine'],
		browsers: ['PhantomJS'],
		colors: true,

		// Which plugins to enable.
		reporters: ['spec', 'coverage'],
		files: [
			'https://code.jquery.com/jquery-1.12.4.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
			'tests/test-helpers.js',
			'assets/js/bgseo/boldgrid-seo-util.js',
			'assets/js/bgseo/boldgrid-seo-title.js',
			'assets/js/bgseo/boldgrid-seo-description.js',
			'assets/js/bgseo/boldgrid-seo-robots.js',
			'assets/js/bgseo/boldgrid-seo-tooltips.js',
			'assets/js/bgseo/boldgrid-seo-keywords.js',
			'assets/js/bgseo/boldgrid-seo-init.js',
			'tests/bgseo/*.js'
		],
		preprocessors: {
			'tests/*.js': [ 'coverage' ],
			'tests/**/*.js': [ 'coverage' ]
		},
		coverageReporter: {
			type: 'html',
			dir: 'coverage/',
			reporters: [

				// Reporters not supporting the `file` property.
				{ type: 'html', subdir: 'report-html' },
				{ type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
				{ type: 'lcov', subdir: 'report-lcov' }
			]
		}
	});
};
