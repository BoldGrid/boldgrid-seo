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
			$( document ).ready( function() {
				self._description();
			});
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
			var desc = self.getDescription();
			// Listen for changes to input value.
			desc.on( 'input propertychange paste', _.debounce( function() {
				var descLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{ 'descLength': descLength }] );
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
			var description = $( '#boldgrid-seo-field-meta_description' );
			return description;
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
			var msg = {};

			// No description has been entered.
			if ( descriptionLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoDescription.length.badEmpty,
				};
			}

			// Character count is 1-124.
			if ( descriptionLength.isBetween( 0, 125 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoDescription.length.ok,
				};
			}

			// Character count is 125-156.
			if ( descriptionLength.isBetween( 124, 157 ) ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoDescription.length.good,
				};
			}

			// Character coutn is over 156.
			if ( descriptionLength > 156 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoDescription.length.badLong,
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
			var keyword = api.Keywords.getKeyword(),
				description = self.getDescription().val();
			return description.occurences( keyword );
		},
	};

	self = api.Description;

})( jQuery );
