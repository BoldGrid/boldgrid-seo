( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Content Analysis.
	 *
	 * This is responsible for general analysis of the user's content.
	 *
	 * @since 1.3.1
	 */
	api.ContentAnalysis = {

		/**
		 * Content Length Score.
		 *
		 * This is responsible for the user's content length scoring.  The content
		 * length for this method is based on the word count, and not character
		 * counts.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} contentLength The length of the content to provide score on.
		 *
		 * @returns {Object} msg Contains the status indicator color and message.
		 */
		seoContentLengthScore: function( contentLength ) {
			var msg = {};
			contentLength = Number( contentLength );

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

		/**
		 * Checks if user has any images in their content.
		 *
		 * This provides a status and message if the user has included an
		 * image in their content for their page/post running analysis.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} imageLength Count of images found within content.
		 *
		 * @returns {Object} msg Contains the status indicator color and message.
		 */
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

		/**
		 * Get count of keywords used in content.
		 *
		 * This checks the content for occurences of the keyword used throughout.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to search for the keyword in.
		 *
		 * @returns {Number} Count of times keyword appears in content.
		 */
		keywords : function( content ) {
			var keyword = api.Keywords.getKeyword();
			return content.occurences( keyword );
		},
	};

	self = api.ContentAnalysis;

})( jQuery );
