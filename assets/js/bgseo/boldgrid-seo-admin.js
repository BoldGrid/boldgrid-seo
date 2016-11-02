var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.Admin = {
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

	self = BOLDGRID.SEO.Admin;

})( jQuery );

BOLDGRID.SEO.Admin.init();
