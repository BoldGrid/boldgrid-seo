( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Util.
	 *
	 * This will contain any utility functions needed across
	 * all classes.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Util = {

		/**
		 * Usage: ( n ).isBetween( min, max )
		 *
		 * Gives you bool response if number is within the minimum
		 * and maximum numbers specified for the range.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} min Minimum number in range to check.
		 * @param {Number} max Maximum number in range to check.
		 *
		 * @returns {bool} Number is/isn't within range passed in params.
		 */
		init : function () {
			// Adds a function for bool response if number is within a range.
			Number.prototype.isBetween = function( min, max ) {
				return this > min && this < max;
			};
		},
	};

	self = BOLDGRID.SEO.Util;

})( jQuery );

BOLDGRID.SEO.Util.init();
