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
			$( document ).ready( self.onReady );
		},

		/**
		 * Sets up event listeners and selector cache in settings on document ready.
		 *
		 * @since 1.3.1
		 */
		onReady : function() {
			self.getSettings();
			self._title();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				title : $( '#boldgrid-seo-field-meta_title' ),
			};
		},

		/**
		 * Gets the SEO Title.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} title Contains wrapped set with BoldGrid SEO Title.
		 */
		getTitle : function() {
			return self.settings.title;
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
			// Listen for changes to input value.
			self.settings.title.on( 'input propertychange paste', _.debounce( function() {
				self.settings.title.trigger( 'bgseo-analysis', [{ titleLength : self.settings.title.val().length }] );
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
			var msg = {}, title;

			title = _bgseoContentAnalysis.seoTitle.length;

			// No title entered.
			if ( titleLength === 0 ) {
				msg = {
					status: 'red',
					msg: title.badEmpty,
				};
			}

			// Title is 1-30 characters.
			if ( titleLength.isBetween( 0, title.okScore + 1 ) ) {
				msg = {
					status: 'yellow',
					msg: title.ok,
				};
			}

			// Title is 30-70 characters.
			if ( titleLength.isBetween( title.okScore - 1, title.goodScore + 1 ) ) {
				msg = {
					status: 'green',
					msg: title.good,
				};
			}

			// Title is grater than 70 characters.
			if ( titleLength > title.goodScore ) {
				msg = {
					status: 'red',
					msg: title.badLong,
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
		 * @param {String} text     (Optional)  The text to search for keyword in.
		 * @param {String} keyword  (Optional)  The keyword to search for.
		 *
		 * @returns {Number} Count of times keyword appears in text.
		 */
		keywords : function( text, keyword ) {
			if ( 0 === arguments.length ) {
				keyword = api.Keywords.getKeyword();
				text = self.getTitle().val();
			} else if ( 1 === arguments.length ) {
				keyword = api.Keywords.getKeyword();
			}

			// Normalize user input.
			text = text.toLowerCase();

			return text.occurences( keyword );
		},
	};

	self = api.Title;

})( jQuery );
