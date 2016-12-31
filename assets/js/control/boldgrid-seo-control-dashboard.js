( function ( $ ) {

	'use strict';

	/**
	 * Registers dashboard display as control.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_control( 'dashboard', {
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

			this.bgseo_template = wp.template( 'butterbean-control-dashboard' );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},

		/**
		 * Get the results report for a given section.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} section The section name to get report for.
		 *
		 * @returns {Object} report The report for the section to display.
		 */
		results : function( data ) {
			var report = {};
			_.each( data, function( key ) {
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
		setAnalysis: function( e, report ) {
			var sectionScore,
			    section = this.model.get( 'section' ),
			    data = _.pick( report, section );

			// Get each of the analysis results to pass for template rendering.
			this.sectionReport = this.results( data );

			// Set the section's report in the model's attributes.
			this.model.set( 'analysis', this.sectionReport );

			// Get score for each section, and set a status for sections.
			_( report ).each( function( section ) {
				// sectionScore should be set.
				if ( ! _.isUndefined ( section.sectionScore ) ) {
					sectionScore = BOLDGRID.SEO.Sections.score( section );
					_( section ).extend( sectionScore );
				}
			});

			// Add the overview score to report.
			_( report.bgseo_keywords ).extend({
				overview : {
					score : BOLDGRID.SEO.Dashboard.overviewScore( report ),
				},
			});

			// Get the status based on the overview score, and add to report.
			_( report.bgseo_keywords.overview ).extend({
				status : BOLDGRID.SEO.Dashboard.overviewStatus( report.bgseo_keywords.overview.score ),
			});

			// Set the nav highlight indicator for each section's tab.
			BOLDGRID.SEO.Sections.navHighlight( report );
			BOLDGRID.SEO.Sections.overviewStatus( report );
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
