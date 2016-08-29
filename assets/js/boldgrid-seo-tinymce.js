( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.TinyMCE = {
		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			self.onloadContent();
			$( document ).ready( function() {
				self.editorChange();
			});
		},
		onloadContent: function() {
			var text,
				editor = $( '#content.wp-editor-area[aria-hidden=false]' );
			$( window ).on( 'load', function() {
				// Check if tinyMCE is available.
				if ( tinymce.activeEditor ) {
					text = tinyMCE.get( wpActiveEditor ).getContent();
				}
				// Check if the editor is available.
				if ( editor.length ) {
					text = $( '#content' ).val();
					text = text.replace( /\r?\n|\r/g, '' );
				}

				return text;
			});
		},
		editorChange: function() {
			var text, targetId;
			$( '#content.wp-editor-area' ).on( 'input propertychange paste', function() {
				targetId = $( this ).attr( 'id' );
				text = self.wpContent( targetId );
			});
			return text;
		},
		tmceChange: function( e ) {
			var text, targetId = e.target.id;
			text = self.wpContent( targetId, 'text' );
			return text;
		},
		wpContent : function( targetId, format ) {
			var text, report = {};
			format = typeof format !== 'undefined' ? format : 'raw';
			switch ( targetId ) {
				// Grab text from TinyMCE Editor.
				case 'tinymce' :
					// Only do this if page/post editor has TinyMCE as active editor.
					if ( tinymce.activeEditor )
						// Define text as the content of the current TinyMCE instance.
						text = tinyMCE.get( wpActiveEditor ).getContent();
					break;
				case 'content' :
					text = $( '#content' ).val();
					text = text.replace( /\r?\n|\r/g, '' );
					break;
			}
			if ( format === 'text' ) {
				text = self.stripper( text );
			}

			if ( text !== '' ) {
				report = self.generateReport( text );
			}

			return report;
		},
		// Strip out remaining traces of HTML to form our cleanText output to scan
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || "";
		},
		generateReport : function( content ) {
			var words, report = {};
			words = textstatistics( content ).wordCount();
			if ( words > 50 ) {
				report = {
					'readingEase' : BOLDGRID.SEO.ContentAnalysis.readingEase( content ),
					'gradeLevel'  : BOLDGRID.SEO.ContentAnalysis.gradeLevel( content ),
					'keywordDensity' : BOLDGRID.SEO.ContentAnalysis.keywordDensity( content, 'Business' ),
				};
			}
			console.log( report );
			return report;
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();
