( function( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Keywords.
	 *
	 * This is responsible for the SEO Keywords Analysis and Scoring.
	 *
	 * @since 1.3.1
	 */
	api.Keywords = {
		/**
		 * Initialize BoldGrid SEO Keyword Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( self.onReady );
		},

		/**
		 * Sets up event listeners and selector cache in settings on document ready.
		 *
		 * @since 1.3.1
		 */
		onReady : function() {
			self.getSettings();
			self._keywords();
			self.setPlaceholder();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				keyword : $( '#bgseo-custom-keyword' ),
				content : api.Editor.element,
			};
		},

		/**
		 * Sets up event listener for changes made to the custom keyword input.
		 *
		 * Listens for changes being made to the custom keyword input, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_keywords: function() {
			self.settings.keyword.on( 'input propertychange paste', _.debounce( function() {
				var msg = {},
				    length = self.settings.keyword.val().length;

				msg = {
					keywords : {
						title : {
							length : api.Title.keywords(),
							lengthScore : 0,
						},
						description : {
							length : api.Description.keywords(),
							lengthScore : 0,
						},
						keyword : self.getCustomKeyword(),
					},
				};

				self.settings.keyword.trigger( 'bgseo-analysis', [msg] );

			}, 1000 ) );
		},

		setPlaceholder : function( keyword ) {
			self.settings.keyword.attr( 'placeholder', keyword );
		},

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
		 * Gets the count of words in the keyword phrase section.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} keywordPhrase The content to count words in.
		 *
		 * @returns {Number} Number of words in keywordPhrase.
		 */
		phraseLength: function( keywordPhrase ) {

			// Check for empty strings.
			if ( keywordPhrase.length === 0 ) {
				return 0;
			}

			// Excludes start and end white-space.
			keywordPhrase = keywordPhrase.replace( /(^\s*)|(\s*$)/gi, '' );

			// 2 or more space to 1.
			keywordPhrase = keywordPhrase.replace( /[ ]{2,}/gi, ' ' );

			// Exclude newline with a start spacing.
			keywordPhrase = keywordPhrase.replace( /\n /, '\n' );

			return keywordPhrase.split( ' ' ).length;
		},

		/**
		 * Calculates keyword density for content and keyword passed in.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to calculate density for.
		 *
		 * @returns {Number} result Calculated density of keyword in content passed.
		 */
		keywordDensity : function( content ) {
			var result, keywordCount, wordCount, keyword;

			keyword = self.getKeyword();

			// Return 0 without calculation if no custom keyword is found.
			if ( _.isUndefined( keyword ) ) return 0;

			// Normalize.
			keyword = keyword.toLowerCase();

			keywordCount = self.keywordCount( content, keyword );
			wordCount = api.Wordcount.count;
			// Get the density.
			result = ( ( keywordCount / wordCount ) * 100 );
			// Round it off.
			result = Math.round( result * 10 ) / 10;

			return result;
		},

		/**
		 * Normalizes the stop words to match the words returned by the WP
		 * WordCount.
		 *
		 * @since 1.3.2
		 *
		 * @param {string} str Word to normalize.
		 *
		 * @returns {string} Normalized word.
		 */
		normalizeWords: function( str ) {
			return str.replace( '\'', '' );
		},

		/**
		 * Trims values of whitespace.
		 *
		 * @since 1.3.2
		 *
		 * @param {string} str Word to trim.
		 *
		 * @returns {string} Trimmed word.
		 */
		trim: function( str ) {
			return str.trim();
		},

		/**
		 * Gets the recommended keywords from content.
		 *
		 * This is what gets suggested to a user that their content is about this
		 * keyword if they do not enter in a custom target keyword or phrase.
		 *
		 * @since 1.3.1
		 *
		 * @param {Array} words The words to search through.
		 * @param {Number} n How many keywords to return back.
		 *
		 * @returns {Array} result An array of n* most frequent keywords.
		 */
		recommendedKeywords: function( words, n ) {
			var stopWords = _bgseoContentAnalysis.stopWords,
			    positions = {},
			    wordCounts = [],
			    result;

			// Abort if no words are passed in.
			if ( _.isEmpty( words ) ) return;

			// Create array from string passed, and trim array values.
			stopWords = stopWords.split( ',' ).map( self.trim );

			// Normalize the stopWords to watch WordPress words.
			stopWords = stopWords.map( self.normalizeWords );

			for ( var i = 0; i < words.length; i++ ) {
				var word = $.trim( words[i] ).toLowerCase();

				// Make sure word isn't in our stop words and is longer than 3 characters.
				if ( ! word || word.length < 3 || stopWords.indexOf( word ) > -1 ) {
					continue;
				}

				if ( _.isUndefined( positions[ word ] ) ) {
					positions[ word ] = wordCounts.length;
					wordCounts.push( [ word, 1 ] );
				} else {
					wordCounts[ positions[ word ] ][1]++;
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

		/**
		 * Retrieves User's Custom SEO Keyword.
		 *
		 * If the user has entered in a custom keyword to run evaluation on,
		 * then we will retrieve this value instead of the automatically
		 * generated keyword recommendation.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} Trimmed output of user supplied custom keyword.
		 */
		getCustomKeyword : function() {
			return $.trim( self.settings.keyword.val() ).toLowerCase();
		},

		/**
		 * Used to get the keyword for the report.
		 *
		 * Checks if a custom keyword has been set by the user, and
		 * if it hasn't it will use the autogenerated keyword that was
		 * determined based on the content.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} customKeyword Contains the customKeyword to add to report.
		 */
		getKeyword : function() {
			var customKeyword,
			    content = api.Editor.ui.getRawText();

			if ( self.getCustomKeyword().length ) {
				customKeyword = self.getCustomKeyword();
			} else if ( ! _.isUndefined( report.textstatistics.recommendedKeywords ) &&
				! _.isUndefined( report.textstatistics.recommendedKeywords[0] ) ) {
					// Set customKeyword to recommended keyword search.
					customKeyword = report.textstatistics.recommendedKeywords[0][0];
			} else if ( _.isEmpty( $.trim( content.text ) ) ) {
				customKeyword = undefined;
			} else {
				self.recommendedKeywords( api.Words.words( content.raw ), 1 );
			}

			return customKeyword;
		},

		/**
		 * Used to get the recommended keyword count.
		 *
		 * Gets the percentages provided for minimum and maximum keyword
		 * densities from the configs.  The number is based on the amount of words
		 * that make up the current page/post.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} count Range for count of keywords based on content length.
		 */
		getRecommendedCount : function( markup ) {
			var count;

			if ( _.isUndefined( markup ) ) {
				markup = api.Words.words( api.Editor.ui.getRawText() );
			}

			count = _.modifyObject( _bgseoContentAnalysis.keywords.recommendedCount, function( item ) {
				var numb = Number( ( item / 100 ) * api.Words.words( markup ).length ).rounded( 0 );
				// Set minimum recommended count to at least once.
				return numb > 0 ? numb : 1;
			});

			return count;
		},

		/**
		 * Used to get the keyword for the report.
		 *
		 * Checks if a custom keyword has been set by the user, and
		 * if it hasn't it will use the autogenerated keyword that was
		 * determined based on the content.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} msg Contains the scoring for each keyword related item.
		 */
		score : function() {
			var msg = {};
			msg = {
				title : self.titleScore(),
				description : self.descriptionScore(),
			};
			return msg;
		},

		/**
		 * Used to get the keyword usage scoring description for the title.
		 *
		 * Checks the count provided for the number of times the keyword was
		 * used in the SEO Title.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count The number of times keyword is used in the title.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		titleScore : function( count ) {
			var msg;

			// Default status and message.
			msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.seoTitle.keywordUsage.good,
			};

			// Keyword not used in title.
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.seoTitle.keywordUsage.bad,
				};
			}

			// Keyword used in title at least once.
			if ( count > 1 ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.seoTitle.keywordUsage.ok,
				};
			}

			return msg;
		},

		/**
		 * Used to get the keyword usage scoring description for the description.
		 *
		 * Checks the count provided for the number of times the keyword was
		 * used in the SEO Description field.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count The number of times keyword is used in the description.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		descriptionScore : function( count ) {
			var msg;

			// Default status and message.
			msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.seoDescription.keywordUsage.good,
			};

			// If not used at all in description.
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.seoDescription.keywordUsage.bad,
				};
			}

			// If used at least one time in description.
			if ( count > 1 ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.seoDescription.keywordUsage.ok,
				};
			}

			return msg;
		},

		/**
		 * Gets keyword score for content.
		 *
		 * Used to get the status and message for the content's keyword usage.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count The number of times keyword is used in the content.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		contentScore : function( count ) {
			var msg, range, description;

			// Get the keyword range based on the content length.
			range = self.getRecommendedCount();

			// Keyword not used at all in content.
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.content.keywordUsage.bad,
				};
			}
			// Keyword used within the range calculated based on content length.
			if ( count.isBetween( range.min - 1, range.max + 1 ) ) {
				description = 1 === range.min ?
					_bgseoContentAnalysis.content.keywordUsage.goodSingular :
					_bgseoContentAnalysis.content.keywordUsage.good.printf( range.min );

				msg = {
					status: 'green',
					msg : description,
				};
			}
			// Keyword used less than the minimum of the range specified, but not 0 times.
			if ( count < range.min && count !== 0 ) {
				description = 1 === range.min ?
					_bgseoContentAnalysis.content.keywordUsage.okShortSingular :
					_bgseoContentAnalysis.content.keywordUsage.okShort.printf( range.min );

				msg = {
					status: 'yellow',
					msg : description,
				};
			}

			// Key word used more than 3 times in the content.
			if ( count > range.max ) {
				description = 1 === range.min ?
					_bgseoContentAnalysis.content.keywordUsage.okLongSingular :
					_bgseoContentAnalysis.content.keywordUsage.okLong.printf( range.min );

				msg = {
					status: 'red',
					msg : description,
				};
			}

			return msg;
		},

		/**
		 * Gets keyword score for headings.
		 *
		 * Used to get the status and message for the heading's keyword usage.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count The number of times keyword is used in the headings.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		headingScore : function( count ) {
			var msg;

			// Default message.
			msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.headings.keywordUsage.good,
			};

			// Keyword not used at all in content.
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.headings.keywordUsage.bad,
				};
			}
			// Key word used more than 3 times in the content.
			if ( count > 3 ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.headings.keywordUsage.ok,
				};
			}

			return msg;
		},

		/**
		 * Used to get the scoring description for the keyword phrase.
		 *
		 * Returns the status message based on how many words are in the phrase.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} count WordCount for phrase.
		 *
		 * @returns {Object} msg Contains the status indicator color and message for report.
		 */
		keywordPhraseScore : function( count ) {
			var msg;

			// Default status and message.
			msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.keywords.keywordPhrase.good,
			};

			// Keyword used in title at least once.
			if ( 1 === count ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.keywords.keywordPhrase.ok,
				};
			}

			// Keyword not used in title.
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.keywords.keywordPhrase.bad,
				};
			}

			return msg;
		},
	};

	self = api.Keywords;

})( jQuery );
