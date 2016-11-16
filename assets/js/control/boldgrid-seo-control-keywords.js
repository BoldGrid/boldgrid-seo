( function ( $ ) {

	'use strict';

	/**
	 * Registers the keywords display as a control.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_control( 'keywords', {
		// Wrapper element for the control.
		tagName : 'div',

		// Custom attributes for the control wrapper.
		attributes : function() {
			return {
				'id'    : 'butterbean-control-' + this.model.get( 'name' ),
				'class' : 'butterbean-control butterbean-control-' + this.model.get( 'type' )
			};
		},
		initialize : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.setAnalysis, this ) );

			this.bgseo_template = wp.template( 'butterbean-control-keywords' );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},
		setAnalysis: function( e, report ) {
			this.model.set( report );
		},

		// Renders the control template.
		render : function() {
			// Only render template if model is active.
			if ( this.model.get( 'active' ) )
				this.el.innerHTML = this.bgseo_template( this.model.toJSON() );
			return this;
		},
	});

})( jQuery );
