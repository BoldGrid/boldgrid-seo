var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var api;

	api = BOLDGRID.SEO;

	/**
	 * BoldGrid SEO Initialize.
	 *
	 * This initializes BoldGrid SEO.
	 *
	 * @since 1.3.1
	 */
	api.Init = {

		/**
		 * Initialize Utilities.
		 *
		 * @since 1.3.1
		 */
		load : function () {
			_.each( api, function( obj ) {
				return obj.init && obj.init();
			});
		},
	};

})( jQuery );

BOLDGRID.SEO.Init.load();
