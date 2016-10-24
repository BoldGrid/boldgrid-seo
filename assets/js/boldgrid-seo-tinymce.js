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
			console.log( text.text.replace(/\[.*?\]/g, " ") );

			$( '#content' ).trigger( 'bgseo-analysis', [text] );

		},
		// Strip out remaining traces of HTML to form our cleanText output to scan
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || " ";
		},
		generateReport : function() {
			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var words, count, report = {};

				// Get WordPress' more acurate word counts.
				if ( eventInfo.count ) {
					report.wordCount = eventInfo.count;
				}

				report = {
					title : {
						length : $( '#boldgrid-seo-field-meta_title' ).val().length,
						keywordUsage : 0,
					},
					description : {
						length : $( '#boldgrid-seo-field-meta_description' ).val().length,
						keywordUsage : 0,
					}
				};

				// Listen for changes to raw HTML in editor.
				if ( eventInfo.raw ) {
					var raw = eventInfo.raw;
					report.rawstatistics = {
						'h1Count': $( raw ).find( 'h1' ).length,
						'h2Count': $( raw ).find( 'h2' ).length,
						'h3Count': $( raw ).find( 'h3' ).length,
					};
				}

				// Listen for changes to the actual text entered by user.
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

				// Listen to changes to the SEO Title.
				if ( eventInfo.titleLength ) {
					report.title.length = eventInfo.titleLength;
				}

				// Listen to changes to the SEO Description.
				if ( eventInfo.descLength ) {
					report.description.length = eventInfo.descLength;
				}

				// Send analysis to display the report.
				$( '#content' ).trigger( 'bgseo-report', [report] );
			});
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();

( function( $, counter ) {
	$( function() {
		var $content = $( '#content' ),
			$count = $( '#wp-word-count' ).find( '.word-count' ),
			prevCount = 0,
			contentEditor;

		function update() {
			var text, count;

			if ( ! contentEditor || contentEditor.isHidden() ) {
				text = $content.val();
			} else {
				text = contentEditor.getContent( { format: 'raw' } );
			}

			count = counter.count( text );

			if ( count !== prevCount ) {
				$content.trigger( 'bgseo-analysis', [{'count': count}]);
			}

			prevCount = count;
		}

		$( document ).on( 'tinymce-editor-init', function( event, editor ) {
			if ( editor.id !== 'content' ) {
				return;
			}

			contentEditor = editor;

			editor.on( 'nodechange keyup', _.debounce( update, 1000 ) );
		} );

		$content.on( 'input keyup', _.debounce( update, 1000 ) );

		update();
	} );
} )( jQuery, new wp.utils.WordCounter() );
