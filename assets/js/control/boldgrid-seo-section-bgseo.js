( function ( $ ) {

	'use strict';

	/**
	 * Registers the keywords display as a control.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_section( 'bgseo', {
		// Executed when the model changes.
		onchange : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );
			// Set the view's `aria-hidden` attribute based on whether the model is selected.
			this.el.setAttribute( 'aria-hidden', ! this.model.get( 'selected' ) );
		},
		getAnalysis: function( e, report ) {
			// Only send report to selected section that's active.
			if ( this.model.get( 'selected' ) ) {
				this.model.set( report );
			}
		},

		ready : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );
			var data = this.model.attributes;
			_.extend( data, this.getAnalysis() );
			console.log( this.model );
		},
	});

})( jQuery );
