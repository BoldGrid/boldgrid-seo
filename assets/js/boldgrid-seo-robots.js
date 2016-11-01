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
				self._index();
				self._follow();
			});
		},
		_index : function() {
			var index = $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index]' );
			// Listen for changes to input value.
			index.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotIndex': self.indexScore() }] );
			});
		},
		indexScore : function() {
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
		_follow : function() {
			var index = $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_follow]' );
			// Listen for changes to input value.
			index.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotIndex': self.followScore() }] );
			});
		},
		followScore : function() {
			var msg = {
				status: 'green',
				msg: 'Great, your links are set to follow for search engines!',
			};
			if ( $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_follow][value=nofollow]' ).is( ':checked' ) ) {
				msg = {
					status: 'yellow',
					msg: 'Your links are set to nofollow for search engines!',
				};
			}
			return msg;
		},
	};

	self = BOLDGRID.SEO.Robots;

})( jQuery );

BOLDGRID.SEO.Robots.init();
