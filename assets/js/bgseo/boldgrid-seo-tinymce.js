( function ( $ ) {

	'use strict';

	var self, api;

	api = BOLDGRID.SEO;

	/**
	 * BoldGrid TinyMCE Analysis.
	 *
	 * This is responsible for generating the actual reports
	 * displayed within the BoldGrid SEO Dashboard when the user
	 * is on a page or a post.
	 *
	 * @since 1.3.1
	 */
	api.TinyMCE = {

		/**
		 * Selector to find editor id.
		 *
		 * @since 1.6.0
		 *
		 * @type {String}
		 */
		selector : '#content',

		/**
		 * Selector to find preview button.
		 *
		 * @since 1.6.0
		 *
		 * @type {String}
		 */
		previewSelector : '#preview-action > .preview.button',

		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.3.1
		 */
		setup : function () {
			$( document ).ready( function() {
				self._setupWordCount();
				self.editorChange();
			});
		},

		/**
		 * Gets the content from TinyMCE or the text editor for analysis.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} content Contains content in raw and text formats.
		 */
		getContent : function() {
			var content,
				tinymce = self.getTinymce();

			if ( tinymce ) {
				content = tinymce.getContent();
			} else {
				content = api.Editor.element.val();
				// Remove newlines and carriage returns.
				content = content.replace( /\r?\n|\r/g, '' );
			}

			var rawContent = $.parseHTML( content );

			// Stores raw and stripped down versions of the content for analysis.
			content = {
				'raw': rawContent,
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
		getRawText: function() {
			var text,
				contentEditor = self.getTinymce();

			if ( ! contentEditor || contentEditor.isHidden() ) {
				text = api.Editor.element.val();
			} else {
				text = contentEditor.getContent( { format: 'raw' } );
				
				// Sometimes, on initial page load, the 'getContent' method doesn't return anything.
				text = text ? text : api.Editor.element.val();
			}

			return text;
		},

		/**
		 * Get Tinymce instance.
		 *
		 * @since 1.6.0
		 *
		 * @return {object} Active wp editor tinymce.
		 */
		getTinymce: function() {
			return 'undefined' !== typeof tinyMCE ? tinyMCE.get( wpActiveEditor ) : null;
		},

		/**
		 * Listens for changes made in the text editor mode.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} text The new content to perform analysis on.
		 */
		editorChange: function() {
			var text, targetId;
			$( '#content.wp-editor-area' ).on( 'input propertychange paste nodechange', function() {
				targetId = $( this ).attr( 'id' );
				text = self.wpContent( targetId );
			});

			return text;
		},

		/**
		 * This gets the content from the TinyMCE Visual editor.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} text
		 */
		tmceChange: function( e ) {
			var text, targetId;

			targetId = e.target.id;
			text = self.wpContent( targetId );

			return text;
		},

		/**
		 * Is this a new Post?
		 *
		 * @since 1.6.0
		 *
		 * @return {boolean} Is this post-new.php?
		 */
		isNewPost : function () {
			return ! $( '#sample-permalink' ).length;
		},

		/**
		 * Checks which editor is the active editor.
		 *
		 * After checking the editor, it will obtain the content and trigger
		 * the report generation with the new user input.
		 *
		 * @since 1.3.1
		 */
		wpContent : function( targetId ) {
			var text = {};

			switch ( targetId ) {
				// Grab text from TinyMCE Editor.
				case 'tinymce' :
					// Only do this if page/post editor has TinyMCE as active editor.
					if ( self.getTinymce() )
						// Define text as the content of the current TinyMCE instance.
						text = self.getTinymce().getContent();
					break;
				case 'content' :
					text = api.Editor.element.val();
					text = text.replace( /\r?\n|\r/g, '' );
					break;
			}

			// Convert raw text to DOM nodes.
			var rawText = $.parseHTML( text );

			text = {
				'raw': rawText,
				'text': api.Editor.stripper( text.toLowerCase() ),
			};

			// Trigger the text analysis for report.
			api.Editor.element.trigger( 'bgseo-analysis', [text] );
		},

		/**
		 * Bind events to the editor input and update the wordcount class.
		 *
		 * @since 1.6.0
		 */
		_setupWordCount : function() {
			var debouncedCb = _.debounce( api.Wordcount.update, 1000 );

			$( document ).on( 'tinymce-editor-init', function( event, editor ) {
				if ( editor.id !== 'content' ) {
					return;
				}

				editor.on( 'AddUndo keyup', debouncedCb );
			} );

			api.Editor.element.on( 'input keyup', debouncedCb );
		}

	};

	self = api.TinyMCE;

})( jQuery );
