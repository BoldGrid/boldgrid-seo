( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.Headings = {

		/**
		 * Initialize BoldGrid SEO Headings Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {

		},
		score : function( count ) {
			var msg = {
					status : 'green',
					msg : _bgseoContentAnalysis.headings.h1.good,
				};
			// If we have more than one H1 tag rendered.
			if ( count > 1 ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badMultiple,
				};
			}
			// If no H1 tag is present.
			if ( 0 === count ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badEmpty,
				};
			}
			return msg;
		},
	};

	self = BOLDGRID.SEO.Headings;

})( jQuery );
