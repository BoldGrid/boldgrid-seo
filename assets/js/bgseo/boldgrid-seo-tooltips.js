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

		/**
		 * Sets up event listeners and selector cache in settings on document ready.
		 *
		 * @since 1.3.1
		 */
		onReady : function() {
			self.getSettings();
			self.hideTooltips();
			self._enableTooltips();
			self._toggleTooltip();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				description : $( '.butterbean-control .butterbean-description' ),
				tooltip : $( '<span />', { 'class' : 'bgseo-tooltip dashicons dashicons-editor-help', 'aria-expanded' : 'false' }),
				onClick : $( '.butterbean-label, .bgseo-tooltip' ),
			};
		},

		/**
		 * Toggle Tooltips
		 *
		 * This sets up the event listener for clicks on tooltips or control labels,
		 * which will hide and show the description of the control for the user.
		 *
		 * @since 1.3.1
		 */
		_toggleTooltip : function() {
			self.settings.onClick.on( 'click', function( e ) {
				self.toggleTooltip( e );
			});
		},

		/**
		 * Enables tooltips for any controls that utilize the description field.
		 *
		 * @since 1.3.1
		 */
		_enableTooltips : function() {
			self.settings.description.prev().append( self.settings.tooltip );
		},

		/**
		 * This handles the toggle of the tooltip open/close.
		 *
		 * @param {Object} e Selector passed from click event.
		 *
		 * @since 1.3.1
		 */
		toggleTooltip : function( e ) {
			$( e.currentTarget ).next( '.butterbean-description' ).slideToggle();
		},

		/**
		 * This hides all tooltips when api.Tooltips is initialized.
		 *
		 * @since 1.3.1
		 */
		hideTooltips : function() {
			self.settings.description.hide();
		},
	};

	self = api.Tooltips;

})( jQuery );
