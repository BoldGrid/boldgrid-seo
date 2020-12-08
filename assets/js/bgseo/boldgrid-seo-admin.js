( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Admin.
	 *
	 * This is responsible for setting the counters for the SEO Title &
	 * Description tab.
	 *
	 * @since 1.2.1
	 */
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
		 *
		 * @param {Object} $element The element to apply the word counter to.
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
		 *
		 * @param {Object} $counter New element to create for counter.
		 * @param {Object} $target Element to check the input value of.
		 * @param {Number} limit The maxlength of the input to calculate on.
		 */
		setCounter : function( $counter, $target, limit ) {
			var text  = $target.val(),
			    chars = text.length;

			$counter.html( limit - chars );

			if ( $target.attr( 'id' ) === 'boldgrid-seo-field-meta_description' ) {
				if ( chars > limit ) {
					$counter.css( { 'color' : '#EA4335' } );
				} else if ( chars.isBetween( 0, _bgseoContentAnalysis.seoDescription.length.okScore ) ) {
					$counter.css( { 'color' : '#FBBC05' } );
				} else if ( chars.isBetween( _bgseoContentAnalysis.seoDescription.length.okScore -1, _bgseoContentAnalysis.seoDescription.length.goodScore + 1 ) ) {
					$counter.css( { 'color' : '#34A853' } );
				} else {
					$counter.css( { 'color' : 'black' } );
				}
			} else {
				if ( chars > limit ) {
					$counter.css( { 'color' : '#EA4335' } );
				} else if ( chars.isBetween( 0, _bgseoContentAnalysis.seoTitle.length.okScore ) ) {
					$counter.css( { 'color' : '#FBBC05' } );
				} else if ( chars > _bgseoContentAnalysis.seoTitle.length.okScore - 1 ) {
					$counter.css( { 'color' : '#34A853' } );
				} else {
					$counter.css( { 'color' : 'black' } );
				}
			}
		},

		/**
		 * Set the word counts for each field in the SEO Title & Description Tab.
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
