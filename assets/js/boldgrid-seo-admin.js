var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.WordCount = {
		/**
		 * Initialize Word Count.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._setWordCounts();
			});
		},

		/**
		 * Get the word count of a metabox field.
		 *
		 * @since 1.2.1
		 */
		wordCount : function( $element ) {
			var limit      = $element.attr( 'maxlength' ),
				$counter   = $( '<span />', {
					'class' : 'boldgrid-seo-meta-counter',
					'style' : 'font-weight: bold'
				}),
				$container = $( '<div />', {
					'class' : 'boldgrid-seo-meta-countdown boldgrid-seo-meta-extra',
					'html'  : ' characters left'
				});

			if ( limit ) {
				 $element
					.removeAttr( 'maxlength' )
					.after( $container.prepend( $counter ) )
					.on( 'keyup focus' , function() {
						self.setCounter( $counter, $element, limit );
					});
			}

			self.setCounter( $counter, $element, limit );
		},

		/**
		 * Set the colors of the count to reflect ideal lengths.
		 *
		 * @since 1.2.1
		 */
		setCounter : function( $counter, $target, limit ) {
			var text  = $target.val(),
			    chars = text.length;

			$counter.html( limit - chars );

			if ( chars > limit ) {
				$counter.css( { 'color' : 'red' } );
			} else if ( chars > 0 && chars < 30 ) {
				$counter.css( { 'color' : 'goldenrod' } );
			} else if ( chars > 29 ) {
				$counter.css( { 'color' : 'limegreen' } );
			} else {
				$counter.css( { 'color' : 'black' } );
			}
		},

		/**
		 * Set the word counts for each field in the SEO Metabox.
		 *
		 * @since 1.2.1
		 */
		_setWordCounts : function() {
			// Apply our wordcount counter to the meta title and meta description textarea fields.
			$( '#boldgrid-seo-field-meta_title, #boldgrid-seo-field-meta_description' )
				.each( function() {
					self.wordCount( $( this ) );
				});
		},
	};

	self = BOLDGRID.SEO.WordCount;

})( jQuery );

BOLDGRID.SEO.WordCount.init();

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
			text = self.wpContent( targetId );
			return text;
		},
		wpContent : function( targetId, format ) {
			var text;
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

			console.log( text );
			return text;
		},
		// Strip out remaining traces of HTML to form our cleanText output to scan
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || "";
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();
