( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Headings.
	 *
	 * This is responsible for the SEO Headings Grading.
	 *
	 * @since 1.3.1
	 */
	api.Headings = {

		/**
		 * Initialize SEO Headings Analysis.
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
			self._checkbox();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				displayTitle : $( '[name="boldgrid-display-post-title"]' ).last(),
			};
		},

		/**
		 * Sets up event listener for Display page title checkbox.
		 *
		 * Listens for checkbox changes and updates the status message.
		 *
		 * @since 1.3.1
		 */
		_checkbox : function() {
			// Listen for changes to input value.
			self.settings.displayTitle.on( 'change', _.debounce( function() {
				$( this ).trigger( 'bgseo-analysis', [ api.Editor.ui.getContent() ] );
			}, 1000 ) );
		},

		/**
		 * Initialize BoldGrid SEO Headings Analysis.
		 *
		 * @since 1.3.1
		 */
		score : function( count ) {
			var msg;

			// Set default message for h1 headings score.
			msg = {
					status : 'green',
					msg : _bgseoContentAnalysis.headings.h1.good,
				};

			// If we have more than one H1 tag rendered.
			if ( count > 1 ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badMultiple,
				};
			}

			// If we have more than one H1 tag rendered.
			if ( count > 1 && self.settings.displayTitle.is( ':checked' ) ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badBoldgridTheme,
				};
			}

			// If no H1 tag is present.
			if ( 0 === count ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badEmpty,
				};
			}

			return msg;
		},

		/**
		 * Gets count of how many times keywords appear in headings.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} headings The headings count object to check against.
		 *
		 * @returns {Number} How many times the keyword appears in the headings.
		 */
		keywords : function( headings ) {
			var found = { length : 0 },
			    keyword = api.Keywords.getKeyword();

			// If not passing in headings, attempt to find default headings.
			if ( _.isUndefined( headings ) ) {
				headings = { count : self.getRealHeadingCount() };
			}

			// Don't process report item if headings are empty.
			if ( _.isEmpty( headings ) ) return;
			// Get the count.
			_( headings.count ).each( function( value, key ) {
				var text = value.text;
				// Add to the found object for total occurences found for keyword in headings.
				_( text ).each( function( item ) {
					found.length =  Number( found.length ) + Number( item.heading.occurences( keyword ) * item.count );
				});
			});

			return found.length;
		},

		/**
		 * Get the text inside of headings.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} selectors jQuery wrapped selector object.
		 *
		 * @returns {Array} headingText Contains each selectors' text.
		 */
		getHeadingText : function( selectors ) {
			var headingText = {};

			headingText = _.countBy( selectors, function( value, key ) {
				return $.trim( $( value ).text().toLowerCase() );
			});
			headingText = _.map( headingText, function( value, key ) {
				return _( headingText ).has({ heading : key, count : value }) ? false : {
					heading : key,
					count : value,
				};
			});

			return headingText;
		},

		/**
		 * Gets the actual headings count based on the rendered page and the content.
		 *
		 * This only needs to be fired if the rendered report
		 * data is available for analysis.  The calculations take
		 * into account the template in use for the page/post and
		 * are stored earlier on in the load process when the user
		 * first enters the editor.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} headings Count of H1, H2, and H3 tags used for page/post.
		 */
		getRealHeadingCount : function() {
			var headings = {};

			// Only get this score if rendered content score has been provided.
			if ( ! _.isUndefined( report.rendered ) ) {
				// Stores the heading coutns for h1-h3 for later analysis.
				headings = {
					count: {
						h1 : {
							length : report.rendered.h1Count + report.rawstatistics.h1Count,
							text : _( report.rendered.h1text ).union( report.rawstatistics.h1text ),
						},
						h2 : {
							length : report.rendered.h2Count + report.rawstatistics.h2Count,
							text : _( report.rendered.h2text ).union( report.rawstatistics.h2text ),
						},
					},
				};
				// Add the score of H1 presence to the headings object.
				_( headings ).extend({
					lengthScore : self.score( headings.count.h1.length ),
				});
			} else {
				headings = self.getContentHeadings();
			}

			return headings;
		},

		/**
		 * Get the headings that exist in the raw content.
		 *
		 * This will get the content and check if any h1s or
		 * h2s exist in the raw markup.  If they are present, it will
		 * update the report with new count information and text.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} headings Counts of h1 and h2 tags in content.
		 */
		getContentHeadings : function() {
			var headings, h1s, h2s, content;

			// Set default counts.
			headings = {
				count: {
					h1 : {
						length : 0,
						text : {},
					},
					h2 : {
						length : 0,
						text : {},
					},
				},
			};

			content = api.Editor.ui.getContent();
			content = $( '<div>' + content.raw + '</div>' );

			h1s = content.find( 'h1' );
			h2s = content.find( 'h2' );

			// If no h1s or h2s are found return the defaults.
			if ( ! h1s.length && ! h2s.length ) return headings;

			headings = {
				count: {
					h1 : {
						length : h1s.length,
						text : self.getHeadingText( h1s ),
					},
					h2 : {
						length : h2s.length,
						text : self.getHeadingText( h2s ),
					},
				},
			};

			return headings;
		},
	};

	self = api.Headings;

})( jQuery );
