( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Util.
	 *
	 * This will contain any utility functions needed across
	 * all classes.
	 *
	 * @since 1.3.1
	 */
	api.Util = {

		/**
		 * Initialize Utilities.
		 *
		 * @since 1.3.1
		 */
		init : function () {

			_.mixin({

				/**
				 * Return a copy of the object only containing the whitelisted properties.
				 * Nested properties are concatenated with dots notation.
				 *
				 * Example:
				 * a = { min: 0.5, max : 2.5 };
				 * _.modifyObject( a, function( item ){ return item * item; });
				 *
				 * Returns:
				 * { min: 0.25, max : 6.25 };
				 *
				 * @since 1.3.1
				 *
				 * @param obj
				 *
				 * @returns {Object} Modified object.
				 */
				modifyObject: function( object, iteratee ) {
					return _.object( _.map( object, function( value, key ) {
						return [ key, iteratee( value ) ];
					}));
				},
				/**
				 * Return a copy of the object only containing the whitelisted properties.
				 * Nested properties are concatenated with dots notation.
				 *
				 * Example:
				 * a = {a:'a', b:{c:'c', d:'d', e:'e'}};
				 * _.pickDeep(a, 'b.c','b.d')
				 *
				 * Returns:
				 * {b:{c:'c',d:'d'}}
				 *
				 * @since 1.3.1
				 *
				 * @param obj
				 *
				 * @returns {Object} copy Object containing only properties requested.
				 */
				pickDeep : function( obj ) {
					var copy = {},
						keys = Array.prototype.concat.apply( Array.prototype, Array.prototype.slice.call( arguments, 1 ) );

					this.each( keys, function( key ) {
						var subKeys = key.split( '.' );
						key = subKeys.shift();

						if ( key in obj ) {
							// pick nested properties
							if( subKeys.length > 0 ) {
								// extend property (if defined before)
								if( copy[ key ] ) {
									_.extend( copy[ key ], _.pickDeep( obj[ key ], subKeys.join( '.' ) ) );
								}
								else {
									copy[ key ] = _.pickDeep( obj[ key ], subKeys.join( '.' ) );
								}
							}
							else {
								copy[ key ] = obj[ key ];
							}
						}
					});

					return copy;
				},
			});

			/**
			 * Function that checks if a field is set.
			 *
			 * @returns {Bool} Is field set.
			 */
			$.fn.extend({
				isFieldSet : function() {
					return Boolean( $.trim( $( this ).val() ).length );
				},
				triggerAll : function ( events, params ) {
					var el = this, i, evts = events.split( ' ' );
					for ( i = 0; i < evts.length; i += 1 ) {
						el.trigger( evts[i], params );
					}
					return el;
				},
			});

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
			if ( ! Number.prototype.isBetween ) {
				Number.prototype.isBetween = function( min, max ) {
					return this > min && this < max;
				};
			}

			/**
			 * Usage: ( n ).rounded( digits )
			 *
			 * Gives you bool response if number is within the minimum
			 * and maximum numbers specified for the range.
			 *
			 * @since 1.3.1
			 *
			 * @param {Number} number Number to round.
			 * @param {Number} digits how many decimal places to round to.
			 *
			 * @returns {Number} rounded The number rounded to specified digits.
			 */
			if ( ! Number.prototype.rounded ) {
				Number.prototype.rounded = function( digits ) {
					var multiple = Math.pow( 10, digits );
					var rounded = Math.round( this * multiple ) / multiple;

					return rounded;
				};
			}

			if ( ! String.prototype.printf ) {
				String.prototype.printf = function() {
					var newStr = this, i = 0;
					while ( /%s/.test( newStr ) ){
						newStr = newStr.replace( "%s", arguments[i++] );
					}

					return newStr;
				};
			}

			/**
			 * Function that counts occurrences of a substring in a string;
			 *
			 * @param {String} string               The string
			 * @param {String} subString            The sub string to search for
			 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
			 *
			 * @returns {Number} n The number of times a substring appears in a string.
			 */
			if ( ! String.prototype.occurences ) {
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
			}
		},
	};

	self = api.Util;

})( jQuery );
