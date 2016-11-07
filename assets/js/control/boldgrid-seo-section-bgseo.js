( function ( $ ) {

	'use strict';

	/**
	 * Registers the keywords display as a control.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_section( 'bgseo', {

		getAnalysis: function( e, report ) {
			this.model.set( report );
		},

		ready : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );
			var data = this.model.attributes;
			_.extend( data, this.getAnalysis() );
			console.log( this.model );
		},
	});

})( jQuery );
