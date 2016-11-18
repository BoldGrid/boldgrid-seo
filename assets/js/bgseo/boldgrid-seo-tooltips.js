( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Tooltips.
	 *
	 * This will add the neccessary functionality for tooltips to be displayed
	 * for each control we create and display.
	 *
	 * @since 1.3.1
	 */
	api.Tooltips = {

		/**
		 * Initializes BoldGrid SEO Tooltips.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( self.onReady );
		},

		onReady : function() {
			self.getSettings();
			self.hideToolTips();
			self._enableTooltips();
			self._toggleTooltip();
		},
		getSettings : function() {
			self.settings = {
				description : $( '.butterbean-control .butterbean-description' ),
				tooltip  : $( '<span />', { 'class' : 'bgseo-tooltip dashicons dashicons-editor-help', 'aria-expanded' : 'false' }),
			};
		},
		_toggleTooltip : function() {
			$( '.butterbean-label, .bgseo-tooltip' ).on( 'click', function( e ) {
				self.toggleTooltip( e );
			});
		},
		_enableTooltips : function() {
			self.settings.description.prev().append( self.settings.tooltip );
		},
		toggleTooltip : function( e ) {
			$( e.currentTarget ).next( '.butterbean-description' ).slideToggle();
		},
		hideToolTips : function() {
			self.settings.description.hide();
		},
	};

	self = api.Tooltips;

})( jQuery );
