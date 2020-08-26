( function ( $ ) {

	'use strict';

	var self, api, report;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid Editor Interface.
	 *
	 * This class allows us to control which editor interface functions will run.
	 * On first load the it runs the setup method of whichever ui is currently loaded.
	 * It then assigns that ui to this classes ui variable for cross api use.
	 *
	 * @since 1.6.0
	 */
	api.Editor = {

		/**
		 * Interface loaded.
		 *
		 * @since 1.6.0
		 *
		 * @type {object} seo.tinymce or seo-Gutenberg
		 */
		ui: null,

		/**
		 * WP Element to use to trigger events.
		 *
		 * @since 1.6.0
		 *
		 * @type {$} Editor jQuery Element.
		 */
		element: null,

		/**
		 * Setup the correct editor interface.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			/*
			 * Determine if we're in Gutenberg or TinyMCE.
			 *
			 * The .block-editor-page class logic comes from a Gutenberg GitHub issue.
			 *
			 * @link https://github.com/WordPress/gutenberg/issues/12200
			 */
			self.ui = document.body.classList.contains( 'block-editor-page' ) ? api.Gutenberg : api.TinyMCE;

			self.element = $( self.ui.selector );
			self.ui.setup();
			self.onloadContent();
		},

		/**
		 * Runs actions on window load to prepare for analysis.
		 *
		 * This method gets the current editor in use by the user on the
		 * initial page load ( text editor or visual editor ), and also
		 * is responsible for creating the iframe preview of the page/post
		 * so we can get the raw html in use by the template/theme the user
		 * has activated.
		 *
		 * @since 1.3.1
		 */
		onloadContent : function() {
			var text,
				editor = $( '#content.wp-editor-area[aria-hidden=false]' );

			$( window ).on( 'load bgseo-media-inserted', function() {
				var content = self.ui.getContent();

				// Get rendered page content from frontend site.
				self.getRenderedContent();

				// Trigger the content analysis for the content.
				_.defer( function() {
					self.element.trigger( 'bgseo-analysis', [content] );
				} );
			} );
		},

		/**
		 * Only ajax for preview if permalink is available. This only
		 * impacts "New" page and posts.  To counter
		 * this we will disable the checks made until the content has had
		 * a chance to be updated. We will store the found headings minus
		 * the initial found headings in the content, so we know what the
		 * template has in use on the actual rendered page.
		 *
		 * @since 1.3.1
		 *
		 * @returns null No return.
		 */
		getRenderedContent : function() {
			var renderedContent, preview;

			// Get the preview url from WordPress.
			preview = $( api.Editor.ui.previewSelector ).attr( 'href' );

			if ( ! api.Editor.ui.isNewPost() ) {
				// Only run this once after the initial iframe has loaded to get current template stats.
				$.get( preview, function( renderedTemplate ) {
					var headings, h1, h2, $rendered;

					// The rendered page content.
					$rendered = $( renderedTemplate );

					// H1's that appear in rendered content.
					h1 = $rendered.find( 'h1' );
					// HS's that appear in rendered content.
					h2 = $rendered.find( 'h2' );

					// The rendered content stats.
					renderedContent = {
						h1Count : h1.length - report.rawstatistics.h1Count,
						h1text : _.filter( api.Headings.getHeadingText( h1 ), function( obj ){
							return ! _.findWhere( report.rawstatistics.h1text, obj );
						}),
						h2Count : h2.length - report.rawstatistics.h2Count,
						h2text : _.filter( api.Headings.getHeadingText( h2 ), function( obj ){
							return ! _.findWhere( report.rawstatistics.h2text, obj );
						}),
					};

					// Add the rendered stats to our report for use later.
					_.extend( report, { rendered : renderedContent } );

					// Trigger the SEO report to rebuild in the template after initial stats are created.
					self.triggerAnalysis();

				}, 'html' );
			}
		},

		/**
		 * Strips out unwanted html.
		 *
		 * This is helpful in removing the  remaining traces of HTML
		 * that is sometimes leftover to form our clean text output and
		 * run our text analysis on.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} The content with any remaining html removed.
		 */
		stripper : function( html ) {
			var tmp;

			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;

			return tmp.textContent || tmp.innerText || " ";
		},

		/**
		 * Fire an event that will force, analysis to run.
		 *
		 * @since 1.6.0
		 */
		triggerAnalysis: function() {
			self.element.trigger( 'bgseo-analysis', [ self.ui.getContent() ] );
		}
	};

	self = api.Editor;

})( jQuery );
