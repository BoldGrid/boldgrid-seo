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
			self.generateReport();
			$( document ).ready( function() {
				self.editorChange();
			});
		},
		onloadContent: function() {
			var text,
				editor = $( '#content.wp-editor-area[aria-hidden=false]' );
			$( window ).on( 'load', function() {
				var content;

				if ( tinymce.ActiveEditor ) {
					content = tinyMCE.get( wpActiveEditor ).getContent();
				} else {
					content = $( '#content' ).val();
					content = content.replace( /\r?\n|\r/g, '' );
				}

				content = {
					'raw': content,
					'text': self.stripper( content.toLowerCase() ),
				};

				$( '#content' ).trigger( 'bgseo-analysis', [content] );
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
			text = self.wpContent( targetId );
			return text;
		},
		wpContent : function( targetId ) {
			var text = {};
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

			text = {
				'raw': text,
				'text': self.stripper( text.toLowerCase() ),
			};
			$( '#content' ).trigger( 'bgseo-analysis', [text] );
		},
		// Strip out remaining traces of HTML to form our cleanText output to scan
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || "";
		},
		generateReport : function() {
			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var words, report = {};
				if ( eventInfo.raw ) {
					var raw = eventInfo.raw;
					report.rawstatistics = {
						'numberOfHeadings': $( raw ).find( 'h1,h2,h3,h4' ).length,
					};
				}
				if ( eventInfo.text ) {
					var content = eventInfo.text;
					words = textstatistics( content ).wordCount();
					if ( words > 50 ) {
						report.textstatistics = {
							'readingEase' : BOLDGRID.SEO.ContentAnalysis.readingEase( content ),
							'gradeLevel'  : BOLDGRID.SEO.ContentAnalysis.gradeLevel( content ),
							'keywordDensity' : BOLDGRID.SEO.ContentAnalysis.keywordDensity( content, 'Business' ),
							'recommendedKeywords' : BOLDGRID.SEO.ContentAnalysis.recommendedKeywords( content, 3 ),
						};
					}
				}
				console.log( report );
			});
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();
