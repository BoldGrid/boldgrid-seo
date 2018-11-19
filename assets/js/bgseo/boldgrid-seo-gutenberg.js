( function ( $ ) {

	'use strict';

	var self, api;

	api = BOLDGRID.SEO;

	/**
	 * BoldGrid Gutenberg Analysis.
	 *
	 * This is responsible for generating the actual reports
	 * displayed within the BoldGrid SEO Dashboard when the user
	 * is on a page or a post.
	 *
	 * @since 1.3.1
	 */
	api.Gutenberg = {

		/**
		 * Selector to find editor id.
		 *
		 * This is only used to trigger events. No dom content queries in Gutenberg context.
		 *
		 * @since 1.6.0
		 *
		 * @type {String}
		 */
		selector : '#editor',

		/**
		 * Selector to find preview button.
		 *
		 * @since 1.6.0
		 *
		 * @type {String}
		 */
		previewSelector : '.editor-post-preview',

		/**
		 * Initialize Content.
		 *
		 * @since 1.6.0
		 */
		setup : function () {
			$( api.Editor.triggerAnalysis );
			self._setupEditorChange();
		},

		/**
		 * Are we currently on a new post?
		 *
		 * @since 1.6.0
		 *
		 * @return {boolean} Is this a post-new.php?
		 */
		isNewPost : function() {
			return wp.data.select( 'core/editor' ).isCleanNewPost();
		},

		/**
		 * Gets the content from the editor for analysis.
		 *
		 * @since 1.6.0
		 *
		 * @returns {Object} content Contains content in raw and text formats.
		 */
		getContent : function() {
			var content = self.getRawText();

			// Stores raw and stripped down versions of the content for analysis.
			content = {
				'raw': content,
				'text': api.Editor.stripper( content.toLowerCase() ),
			};

			return content;
		},

		/**
		 * Get the raw text from the editor.
		 *
		 * @since 1.6.0
		 *
		 * @return {string} Editor content.
		 */
		getRawText : function () {
			return wp.data.select( 'core/editor' ).getEditedPostAttribute( 'content' );
		},

		/**
		 * Listens for changes made in the text editor mode.
		 *
		 * @since 1.6.0
		 *
		 * @returns {string} text The new content to perform analysis on.
		 */
		_setupEditorChange: function() {
			var latestContent = '';

			wp.data.subscribe( _.debounce( function () {

				// Make sure content is different before running analysis.
				if ( self.getRawText() !== latestContent ) {
					api.Wordcount.update();
					api.Editor.triggerAnalysis();
					latestContent = self.getRawText();
				}
			}, 1000 ) );
		}
	};

	self = api.Gutenberg;

})( jQuery );
