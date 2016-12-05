( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Description.
	 *
	 * This is responsible for the SEO Description Grading.
	 *
	 * @since 1.3.1
	 */
	api.Description = {

		/**
		 * Initialize SEO Description Analysis.
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
			self._description();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				description : $( '#boldgrid-seo-field-meta_description' ),
			};
		},

		/**
		 * Sets up event listener for changes made to the SEO Description.
		 *
		 * Listens for changes being made to the SEO Description, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_description : function() {
			// Listen for changes to input value.
			self.settings.description.on( 'input propertychange paste', _.debounce( function() {
				$( this ).trigger( 'bgseo-analysis', [{ descLength : self.settings.description.val().length }] );
			}, 1000 ) );
		},

		/**
		 * Gets the SEO Description.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} description Contains wrapped set with BoldGrid SEO Description.
		 */
		getDescription : function() {
			return self.settings.description;
		},

		/**
		 * Gets score of the SEO Description.
		 *
		 * Checks the length provided and returns a score and status color
		 * for the SEO description.  This score is based on character count.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} descriptionLength Length of the user's SEO Description.
		 *
		 * @returns {Object} msg Contains status indicator color and message to update.
		 */
		descriptionScore : function( descriptionLength ) {
			var msg = {}, desc;

			desc = _bgseoContentAnalysis.seoDescription.length;

			// No description has been entered.
			if ( descriptionLength === 0 ) {
				msg = {
					status: 'red',
					msg: desc.badEmpty,
				};
			}

			// Character count is 1-124.
			if ( descriptionLength.isBetween( 0, desc.okScore ) ) {
				msg = {
					status: 'yellow',
					msg: desc.ok,
				};
			}

			// Character count is 125-156.
			if ( descriptionLength.isBetween( desc.okScore - 1, desc.goodScore + 1 ) ) {
				msg = {
					status: 'green',
					msg: desc.good,
				};
			}

			// Character coutn is over 156.
			if ( descriptionLength > desc.goodScore ) {
				msg = {
					status: 'red',
					msg: desc.badLong,
				};
			}

			return msg;
		},

		/**
		 * Gets the number of occurences in the SEO Description.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Number} Frequency that keyword appears in description.
		 */
		keywords : function() {
			var keyword, description;

			// Get keyword.
			keyword = api.Keywords.getKeyword();
			// Get text from input.
			description = self.getDescription().val();
			// Normalize user input.
			description = description.toLowerCase();

			return description.occurences( keyword );
		},
	};

	self = api.Description;

})( jQuery );
