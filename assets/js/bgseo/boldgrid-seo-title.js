var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Title.
	 *
	 * This is responsible for the SEO Title Grading.
	 *
	 * @since 1.3.1
	 */
	api.Title = {

		/**
		 * Initialize SEO Title Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._title();
			});
		},

		/**
		 * Gets the SEO Title.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} title Contains wrapped set with BoldGrid SEO Title.
		 */
		getTitle : function() {
			var title = $( '#boldgrid-seo-field-meta_title' );
			return title;
		},

		/**
		 * Sets up event listener for changes made to the SEO Title.
		 *
		 * Listens for changes being made to the SEO Title, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_title: function() {
			var title = self.getTitle();
			// Listen for changes to input value.
			title.on( 'input propertychange paste', _.debounce( function() {
				var titleLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{'titleLength': titleLength}] );
			}, 1000 ) );
		},

		/**
		 * Gets score of the SEO Title.
		 *
		 * Checks the length provided and returns a score for the SEO
		 * title.  This score is based on character count.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} titleLength The length of the title to generate score for.
		 *
		 * @returns {Object} msg Contains status indicator color and message to update.
		 */
		titleScore: function( titleLength ) {
			var msg = {};

			// No title entered.
			if ( titleLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badEmpty,
				};
			}

			// Title is 1-30 characters.
			if ( titleLength.isBetween( 0, 31 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoTitle.length.ok,
				};
			}

			// Title is 30-70 characters.
			if ( titleLength.isBetween( 30, 71 ) ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoTitle.length.good,
				};
			}

			// Title is grater than 70 characters.
			if ( titleLength > 70 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badLong,
				};
			}

			return msg;
		},

		/**
		 * Get count of keywords used in the title.
		 *
		 * This checks the title for keyword frequency.
		 *
		 * @since 1.3.1
		 *
		 * @param {String} keyword  (Optional)  The keyword to search for.
		 * @param {String} text     (Optional)  The text to search for keyword in.
		 *
		 * @returns {Number} Count of times keyword appears in text.
		 */
		keywords : function( keyword, text ) {
			// Optional param gets keyword from api if not provided.
			if ( _.isUndefined( keyword ) ) {
				keyword = api.Keywords.getKeyword();
			}
			// Optional param gets SEO title if text not provided.
			if ( _.isUndefined( text ) ) {
				text = self.getTitle().val();
			}

			return text.occurences( keyword );
		},
	};

	self = api.Title;

})( jQuery );
