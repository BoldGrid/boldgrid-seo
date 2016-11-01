( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.Robots = {
		/**
		 * Initialize SEO Title Analysis.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			$( document ).ready( function() {
				self.getIndex();
			});
		},
		getIndex: function() {
			var index = $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index]' );
			// Listen for changes to input value.
			index.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotIndex': self.indexScore() }] );
			});
		},
		indexScore: function() {
			var msg = {
				status: 'green',
				msg: 'This article is being indexed by search engines!',
			};
			if ( $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index][value=noindex]' ).is( ':checked' ) ) {
				msg = {
					status: 'yellow',
					msg: 'Your page is being blocked from search engine indexing!',
				};
			}
			return msg;
		},
	};

	self = BOLDGRID.SEO.Robots;

})( jQuery );

BOLDGRID.SEO.Robots.init();
