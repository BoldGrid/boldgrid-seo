( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.SeoTitle = {
		/**
		 * Initialize SEO Title Analysis.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			$( document ).ready( function() {
				self.seoTitle();
			});
		},
		seoTitle: function() {
			var title = $( '#boldgrid-seo-field-meta_title' );
			// Listen for changes to input value.
			title.on( 'input propertychange paste', function() {
				var titleLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{'titleLength': titleLength}] );
			});
		},
		seoTitleLengthScore: function( titleLength ) {
			var msg = {};

			if ( titleLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badEmpty,
				};
			}
			if ( titleLength > 0 && titleLength < 30) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoTitle.length.ok,
				};
			}
			if ( titleLength > 30 && titleLength < 70) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoTitle.length.good,
				};
			}

			if ( titleLength > 70 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badLong,
				};
			}

			return msg;
		},
	};

	self = BOLDGRID.SEO.SeoTitle;

})( jQuery );

BOLDGRID.SEO.SeoTitle.init();
