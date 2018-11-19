( function( $, counter ) {

	'use strict';

	var self, api;

	api = BOLDGRID.SEO;

	/**
	 * Handle tracking of wordcount.
	 *
	 * @since 1.6.0
	 */
	api.Wordcount = {

		/**
		 * Number of words in the content.
		 *
		 * @since 1.6.0
		 *
		 * @type {Number}
		 */
		count: 0,

		/**
		 * List of words on the page.
		 *
		 * @since 1.6.0
		 *
		 * @type {array}
		 */
		words: [],

		/**
		 * When the page loads, run the update methods.
		 *
		 * @since 1.6.0
		 */
		init : function () {
			$( self.update );
		},

		/**
		 * Update this classes word count metrics.
		 *
		 * @since 1.6.0
		 */
		update : function () {
			var count,
				words,
				text = api.Editor.ui.getRawText();

			count = counter.count( text );
			words = BOLDGRID.SEO.Words.words( text );

			if ( count !== self.count ) {
				api.Editor.element.trigger( 'bgseo-analysis', [{ words : words, count : count }] );
			}

			self.words = words;
			self.count = count;
		}
	};

	self = api.Wordcount;

} )( jQuery, new wp.utils.WordCounter() );
