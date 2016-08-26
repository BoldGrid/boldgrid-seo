var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.WordCount = {
		/**
		 * Initialize Word Count.
		 */
		init : function () {
			$( document ).ready( function() {
				self._setWordCounts();
			});
		},

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

		// Set the counter element for meta description and meta title
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

		// Set the WordCounts in the SEO Metabox
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

BOLDGRID.SEO.WordCount = new BOLDGRID.SEO.WordCount.init();
