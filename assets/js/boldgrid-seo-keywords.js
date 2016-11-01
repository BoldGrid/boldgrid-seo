( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Keywords.
	 *
	 * This is responsible for the SEO Keywords Analysis and Scoring.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Keywords = {

		/**
		 * Gets the count of the keywords in the content passed in.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to count keyword frequency in.
		 * @param {string} keyword The keyword/phrase to search for.
		 *
		 * @returns {Number} keywordCount Represents how many times a keyword appears.
		 */
		keywordCount: function( content, keyword ) {
			var keywordCount;

			keywordCount = content.split( keyword ).length - 1;

			return keywordCount;
		},

		/**
		 * Calculates keyword density for content and keyword passed in.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to calculate density for.
		 * @param {string} keyword The keyword to base density measurement on.
		 *
		 * @returns {Number} result Calculated density of keyword in content passed.
		 */
		keywordDensity : function( content, keyword ) {
			var result, keywordCount, wordCount;

			// Normalize.
			keyword = keyword.toLowerCase();

			keywordCount = self.keywordCount( content, keyword );
			wordCount = textstatistics( content ).wordCount();
			// Get the density.
			result = ( ( keywordCount / wordCount ) * 100 );
			// Round it off.
			result = Math.round( result * 10 ) / 10;

			return result;
		},

		/**
		 * Gets the recommended keywords from content.
		 *
		 * This is what gets suggested to a user that their content is about this
		 * keyword if they do not enter in a custom target keyword or phrase.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} text The text to search through.
		 * @param {Number} n How many keywords to return back.
		 *
		 * @returns {Array} result An array of n* most frequent keywords.
		 */
		recommendedKeywords: function( text, n ) {
			// Split text on non word characters
			var words = text.toLowerCase().split( /\W+/ ),
			    positions = {},
			    wordCounts = [],
			    result;

			for ( var i=0; i < words.length; i++ ) {
				var word = words[i];
				if ( ! word || word.length < 3 || _bgseoStopWords.indexOf( word ) > -1 ) {
					continue;
				}

				if ( typeof positions[word] == 'undefined' ) {
					positions[word] = wordCounts.length;
					wordCounts.push( [word, 1] );
				} else {
					wordCounts[positions[word]][1]++;
				}
			}
			// Put most frequent words at the beginning.
			wordCounts.sort( function ( a, b ) {
				return b[1] - a[1];
			});
			// Return the first n items
			result = wordCounts.slice( 0, n );

			return result;
		},
	};

	self = BOLDGRID.SEO.Keywords;

})( jQuery );
