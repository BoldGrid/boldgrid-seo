var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;



	/**
	 * BoldGrid SEO Robots.
	 *
	 * This is responsible for the noindex and nofollow checkbox
	 * listeners, and returning status/scores for each.
	 *
	 * @since 1.3.1
	 */
	api.Robots = {

		/**
		 * Initialize BoldGrid SEO Robots.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( self.onReady );
		},

		/**
		 * Sets up event listeners and selector cache in settings on document ready.
		 *
		 * @since 1.3.1
		 */
		onReady : function() {
			self.getSettings();
			self._index();
			self._follow();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				indexInput : $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index]' ),
				noIndex : $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index][value="noindex"]' ),
				followInput : $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_follow]' ),
				noFollow : $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_follow][value="nofollow"]' ),
			};
		},

		/**
		 * Sets up event listener for index/noindex radios.
		 *
		 * Listens for changes being made on the radios, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_index : function() {
			self.settings.indexInput.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotIndex': self.indexScore() }] );
			});
		},

		/**
		 * Gets score of index/noindex status.
		 *
		 * Checks if index/noindex is checked and returns appropriate
		 * status message and indicator.
		 *
		 * @since 1.3.1
		 * @returns {Object} Contains status indicator color and message to update.
		 */
		indexScore : function() {
			var msg;

			// Index radio is selected.
			msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.noIndex.good,
			};

			// Noindex radio is selected.
			if ( self.settings.noIndex.is( ':checked' ) ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.noIndex.bad,
				};
			}

			return msg;
		},

		/**
		 * Sets up event listener for follow/nofollow radios.
		 *
		 * Listens for changes being made on the radios, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_follow : function() {
			// Listen for changes to input value.
			self.settings.followInput.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotFollow': self.followScore() }] );
			});
		},

		/**
		 * Gets score of follow/nofollow status.
		 *
		 * Checks if follow or nofollow is checked, and returns appropriate
		 * status message and indicator.
		 *
		 * @since 1.3.1
		 * @returns {Object} Contains status indicator color and message to update.
		 */
		followScore : function() {
			var msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.noFollow.good,
			};

			if ( self.settings.noFollow.is( ':checked' ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.noFollow.bad,
				};
			}

			return msg;
		},
	};

	self = api.Robots;

})( jQuery );
