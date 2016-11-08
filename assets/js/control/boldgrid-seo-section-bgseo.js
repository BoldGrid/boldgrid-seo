( function ( $ ) {

	'use strict';

	/**
	 * Registers the custom BoldGrid SEO Sections to include analysis results in
	 * each section's template.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_section( 'bgseo', {

		/**
		 * Get the results report for a given section.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} section The section name to get report for.
		 *
		 * @returns {Object} report The report for the section to display.
		 */
		results : function( section ) {
			var report = {};
			_.each( section, function( key ) {
				_.extend( report, key );
			});
			return report;
		},

		/**
		 * Gets the analysis for the section from the reporter.
		 *
		 * This is bound to the bgseo-report event, and will process
		 * the report and add only the analysis for the current section displayed.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The full report as it's updated by reporter.
		 */
		getAnalysis: function( e, report ) {
			var name = this.model.get( 'name' ),
			    section = _.pick( report, name );

			// Get each of the analysis results to pass for template rendering.
			this.sectionReport = this.results( section );

			// Set the section's report in the model's attributes.
			this.model.set( 'analysis', this.sectionReport );
		},

		/**
		 * This is ran after the bgseo section has rendered.
		 *
		 * @since 1.3.1
		 */
		ready : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );
		},
	});

})( jQuery );
