( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Tooltips.
	 *
	 * This will add the neccessary functionality for tooltips to be displayed
	 * for each control we create and display.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Tooltips = {

		/**
		 * Initializes BoldGrid SEO Tooltips.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self.hideToolTips();
				self._enableTooltips();
				self._toggleTooltip();
			});
		},
		_toggleTooltip : function() {
			$( '.butterbean-label, .bgseo-tooltip' ).on( 'click', function( e ) {
				self.toggleTooltip( e );
			});
		},
		_enableTooltips : function() {
			var controls = $( '.butterbean-label' ).next( '.butterbean-description' ),
			    $tooltip = $( '<span />', {
					'class'         : 'bgseo-tooltip dashicons dashicons-editor-help',
					'aria-expanded' : 'false'
				});

			// If a description exists for any of the controls, add the tooltip.
			if ( controls.length ) {
				controls.prev().append( $tooltip );
			}
		},
		toggleTooltip : function( e ) {
			$( e.currentTarget ).next( '.butterbean-description' ).slideToggle();
		},
		hideToolTips : function() {
			$( '.butterbean-control .butterbean-description' ).hide();
		},
	};

	self = BOLDGRID.SEO.Tooltips;

})( jQuery );

BOLDGRID.SEO.Tooltips.init();
