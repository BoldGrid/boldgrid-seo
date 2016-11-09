( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Dashboard.
	 *
	 * This is responsible for any Dashboard section specific functionality.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Dashboard = {

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
			var statuses = self.getStatuses( report ),
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

	self = BOLDGRID.SEO.Dashboard;

})( jQuery );
