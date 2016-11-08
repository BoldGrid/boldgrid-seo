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
		// Initializes the view.
		initialize : function() {
			// Binds to bgseo-report event.
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );

			// Add an event for when the model changes.
			this.model.on( 'change', this.onchange, this );

			// Get the section type.
			var type = this.model.get( 'type' );

			// If there's no template for this section type, create it.
			if ( ! butterbean.templates.section_exists( type ) )
				butterbean.templates.register_section( type );

			// Gets the section template.
			this.template = butterbean.templates.get_section( type );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},

	});

})( jQuery );
