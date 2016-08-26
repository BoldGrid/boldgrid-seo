var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {
	'use strict';

	var self;

	$.fn.extend( {
		wordcount : function(  ) {
			var $this      = $( this ),
				limit      = $this.attr( 'maxlength' ),
				$counter   = $( '<span />', {
					'class' : 'boldgrid-seo-meta-counter',
					'style' : 'font-weight: bold'
				} ),
				$container = $( '<div />', {
					'class' : 'boldgrid-seo-meta-countdown boldgrid-seo-meta-extra',
					'html'  : ' characters left'
				} );

			if ( limit ) {
				 $this
					.removeAttr( 'maxlength' )
					.after( $container.prepend( $counter ) )
					.on( 'keyup focus' , function(  ) {
						$counter.setCounter( $this, limit );
					} );
			}

			$counter.setCounter( $this, limit );
		},

		// Set the counter element for meta description and meta title
		setCounter : function( $target, limit ) {
			var $this = $( this ),
				text  = $target.val(  ),
				chars = text.length;

			$( this ).html( limit - chars );

			if ( chars > limit ) {
				$this.css( { 'color' : 'red' } );
			} else if ( chars > 0 && chars < 30 ) {
				$this.css( { 'color' : 'goldenrod' } );
			} else if ( chars > 29 ) {
				$this.css( { 'color' : 'limegreen' } );
			} else {
				$this.css( { 'color' : 'black' } );
			}
		}
	} );

	BOLDGRID.SEO.WordCount = {
		/**
		 * Initialize Word Count.
		 */
		init : function () {
			$( document ).ready( function() {
				self.setWordCount();
			});
		},

		setWordCount : function () {
			var $meta_title_height, $wp_screen_columns;

			// Meta Title's textarea's height to set
			$meta_title_height = $( '#boldgrid-seo-field-meta_title' );
			// Screen Column's partial selector.
			$wp_screen_columns = '#adv-settings > div.columns-prefs > .columns-prefs-';

			// Check Screen Column tab > Screen Layout and see if the single column radio is marked.
			if( $( $wp_screen_columns + '1 input:radio:checked' ).length > 0 ) {
				// Set to a height of one since it's full width.
				$meta_title_height.attr( 'rows', '1' );
			// Or assume that 2 columns is used since we only have a choice of 1 or 2 columns.
			} else {
				// Set to a height of two since it's much more compact.
				$meta_title_height.attr( 'rows', '2' );
			}

			// Delegate event to the 1 column radio to listen for change and activate trigger.
			$( document ).delegate( $wp_screen_columns + '1 input:radio:checked',
				// What to do if change happens.
				'change', function( event ) {
					// We will set the height of the meta title section to one row.
					$meta_title_height.attr( 'rows', '1' );
				}
			);

			// Delegate event to the 2 column radio to listen for change and activate trigger.
			$( document ).delegate( $wp_screen_columns + '2 input:radio:checked',
				// What to do if change happens.
				'change', function( event ) {
					// We will set the height of the meta title section to two rows.
					$meta_title_height.attr( 'rows', '2' );
				}
			);

			// Trigger events on change.
			$( $wp_screen_columns + '2 input:radio:checked' )
				.trigger( 'change' );

			// Apply our wordcount counter to the meta title and meta description textarea fields.
			$( '#boldgrid-seo-field-meta_title, #boldgrid-seo-field-meta_description' )
				.each( function() {
					$( this ).wordcount();
				} );
		},
	};

	self = BOLDGRID.SEO.WordCount;
})( jQuery );

BOLDGRID.SEO = new BOLDGRID.SEO.WordCount.init();
