( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Sections.
	 *
	 * This is responsible for section related statuses and modifications.
	 *
	 * @since 1.3.1
	 */
	api.Sections = {

		/**
		 * Gets the status for a section.
		 *
		 * This will get the status based on the scores received for each
		 * section and return the status color as the report is updated.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} sectionScores The scores for the section.
		 *
		 * @returns {string} status The status color to assign to the section.
		 */
		status : function( sectionScores ) {
			// Default status is set to green.
			var status = 'green';

			// Check if we have any red or yellow statuses and update as needed.
			if ( sectionScores.red > 0 ) {
				status = 'red';
			} else if ( sectionScores.yellow > 0 ) {
				status = 'yellow';
			}

			return status;
		},

		/**
		 * Gets the score and status of a section.
		 *
		 * This is responsible for getting the count of statuses that
		 * are set for each item in the report for a section.  It will
		 * return the data that is added to the report..
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} section The section to get a score for.
		 *
		 * @returns {Object} data Contains the section status scores and section status.
		 */
		score : function( section ) {

			var sectionScores, score, data;

			// Set default counters for each status.
			sectionScores = { red: 0, green : 0, yellow : 0 };

			// Get the count of scores in object by status.
			score = _( section ).countBy( function( items ) {
				return  ! _.isUndefined( items.lengthScore ) && 'sectionScore' !== _.property( 'sectionScore' )( section ) ? items.lengthScore.status : '';
			});

			// Update the object with the new count.
			_( score ).each( function( value, key ) {
				if ( _.has( sectionScores , key ) ) {
					sectionScores[key] = value;
				}
			});

			// Update the section's score and status.
			data = {
				sectionScore : sectionScores,
				sectionStatus: self.status( sectionScores ),
			};

			return data;
		},

		removeStatus : function( selector ) {
			selector.removeClass( 'red yellow green' );
		},

		navHighlight : function( report ) {
			_.each( butterbean.models.sections, function( item ) {
				var selector,
				    manager = item.get( 'manager' ),
				    name = item.get( 'name' );

				selector = $( '[href="#butterbean-' + manager + '-section-' + name + '"]' ).closest( 'li' );
				self.removeStatus( selector );
				selector.addClass( report[name].sectionStatus );
			});
		},
		overviewStatus : function( report ) {
			var selector = $( "#butterbean-ui-boldgrid_seo.postbox > h2 > span:contains('Easy SEO')" );
			self.removeStatus( selector );
			selector.addClass( 'overview-status ' + report.bgseo_keywords.overview.status );
		}
	};

	self = api.Sections;

})( jQuery );
