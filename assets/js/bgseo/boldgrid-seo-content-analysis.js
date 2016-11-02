( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.ContentAnalysis = {
		// Measured by word count.
		seoContentLengthScore: function( contentLength ) {
			var msg = {};

			if ( contentLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.content.length.badEmpty,
				};
			}
			if ( contentLength.isBetween( 0, 199 ) ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.content.length.badShort,
				};
			}
			if ( contentLength.isBetween( 198, 300 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.content.length.ok,
				};
			}
			if ( contentLength > 299 ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.content.length.good,
				};
			}

			return msg;
		},
		// Checks if user has any images in their content.
		seoImageLengthScore: function( imageLength ) {
			var msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.image.length.good,
			};
			if ( ! imageLength ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.image.length.bad,
				};
			}

			return msg;
		},
	};


	self = BOLDGRID.SEO.ContentAnalysis;

})( jQuery );
