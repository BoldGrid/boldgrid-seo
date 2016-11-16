( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Dashboard.
	 *
	 * This is responsible for any Dashboard section specific functionality.
	 *
	 * @since 1.3.1
	 */
	api.Dashboard = {

		/**
		 * This gets the overview score.
		 *
		 * Number is a percentage.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Number} The rounded percentage value for overall score.
		 */
		overviewScore : function( report ) {
			var max,
			    total = self.totalScore( report ),
			    sections = _.size( butterbean.models.sections );

				max = sections * 2;

			return ( total / max  * 100 ).rounded( 2 );
		},

		/**
		 * This gets the overview status.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} score The BoldGrid SEO overview status score.
		 *
		 * @returns {string} The status indicator color of the overall scoring.
		 */
		overviewStatus : function( score ) {
			var status;

			// Default overview status.
			status = 'green';

			// If status is below 40%.
			if ( score < 40 ) {
				status = 'red';
			}

			// Status is 40% - 75%.
			if ( score.isBetween( 39, 76 ) ) {
				status = 'yellow';
			}

			return status;
		},

		/**
		 * Get the combined statuses for each section in BoldGrid SEO metabox.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Object} status The combined statuses for all sections.
		 */
		getStatuses : function( report ) {
			var status = {};

			_.each( butterbean.models.sections, function( section ) {
				var score, name = section.get( 'name' );
				score = report[name].sectionStatus;
				status[name] = score;
				_( status[name] ).extend( score );
			});

			return status;
		},

		/**
		 * Assigns numbers to represent the statuses.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Object} score The numerical values based on status rank.
		 */
		assignNumbers : function( report ) {
			var score, statuses;

			statuses = self.getStatuses( report );

			// Map strings into score values.
			score = _.mapObject( statuses, function( status ) {
				var score;

				if ( status === 'red' ) score = 0;
				if ( status === 'yellow' ) score = 1;
				if ( status === 'green' ) score = 2;

				return score;
			});

			return score;
		},

		/**
		 * Combines all the status scores into a final sum.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Object} total The total overall numerical value for statuses.
		 */
		totalScore : function( report ) {
			var total, statuses = self.assignNumbers( report );

			total = _( statuses ).reduce( function( initial, number ) {
				return initial + number;
			}, 0 );

			return total;
		}
	};

	self = api.Dashboard;

})( jQuery );
