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
		 * Initialize Utilities.
		 *
		 * @since 1.3.1
		 */
		init : function () {

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
			Number.prototype.isBetween = function( min, max ) {
				return this > min && this < max;
			};

			/** Function that count occurrences of a substring in a string;
			 * @param {String} string               The string
			 * @param {String} subString            The sub string to search for
			 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
			 */
			String.prototype.occurences = function( needle, allowOverlapping ) {

				needle += "";
				if ( needle.length <= 0 ) return ( this.length + 1 );

				var n = 0,
					pos = 0,
					step = allowOverlapping ? 1 : needle.length;

				while ( true ) {
					pos = this.indexOf( needle, pos );
					if ( pos >= 0 ) {
						++n;
						pos += step;
					} else break;
				}

				return n;
			};
		},
	};

	self = BOLDGRID.SEO.Util;

})( jQuery );

BOLDGRID.SEO.Util.init();
