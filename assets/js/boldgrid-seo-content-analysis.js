( function ( $ ) {
	'use strict';

	var self;

	BOLDGRID.SEO.ContentAnalysis = {
		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			$( document ).ready( function() {
				self.seoTitle();
				self.seoDescription();
			});
			$( document ).on( 'bgseo-analysis', function(e, eventInfo) {
				console.log( eventInfo );
			});
		},
		// Gets the Flesch Kincaid Reading Ease Score.
		readingEase: function( content ) {
			var result;
			result = textstatistics( content ).fleschKincaidReadingEase();
			$( '#content' ).trigger( 'bgseo-analysis', [{ 'readingEase': result }] );
			return result;
		},
		// Get the Flesch Kincaid Grade Level from content.
		gradeLevel: function( content ) {
			var grade, result= {};
			grade = textstatistics( content ).fleschKincaidGradeLevel();
			result = self.gradeAnalysis( grade );
			return result;
		},
		// Returns information about the grade for display.
		gradeAnalysis: function( grade ) {
			var description = {};
			grade = grade * 10;
			if ( grade > 100 && grade < 90 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '5th grade',
					'explanation': 'Very easy to read. Easily understood by an average 11-year-old student.',
				};
			}
			if ( grade > 80 && grade < 90 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '6th grade',
					'explanation': 'Easy to read. Conversational English for consumers.',
				};
			}
			if ( grade > 70 && grade < 80 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '7th grade',
					'explanation': 'Fairly easy to read.',
				};
			}
			if ( grade > 60 && grade < 70 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '8th & 9th',
					'explanation': 'Plain English. Easily understood by 13- to 15-year-old students.',
				};
			}
			if ( grade > 50 && grade < 60 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '10th to 12th',
					'explanation': 'Fairly difficult to read.',
				};
			}
			if ( grade > 30 && grade < 50 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Student',
					'explanation': 'Difficult to read.',
				};
			}
			if ( grade < 30 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Graduate',
					'explanation': 'Difficult to read.',
				};
			}
			return description;
		},
		getKeywords: function() {

		},
		// Gets the count of the keywords in the content.
		keywordCount: function( content, keyword ) {
			var keywordCount;
			keywordCount = content.split( keyword ).length - 1;
			return keywordCount;
		},
		// Very basic kw density check.
		keywordDensity : function( content, keyword ) {
			var result, keywordCount, wordCount;

			// Normalize.
			keyword = keyword.toLowerCase();

			keywordCount = self.keywordCount( content, keyword );
			wordCount = textstatistics( content ).wordCount();
			result = ( ( keywordCount / wordCount ) * 100 );

			return result;
		},
		// Get recommended keywords from content.
		recommendedKeywords: function( text, n ) {
			// Split text on non word characters
			var words = text.toLowerCase().split( /\W+/ ),
			    positions = [],
			    wordCounts = [];

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
		seoTitle: function() {
			var title = $( '#boldgrid-seo-field-meta_title' );
			// Listen for changes to input value.
			title.on( 'input propertychange paste', function() {
				var titleLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{'titleLength': titleLength}] );
			});
			title.trigger( 'bgseo-analysis', [{ 'titleLength': title.val().length }] );
		},
		seoDescription: function() {
			var desc = $( '#boldgrid-seo-field-meta_description' );
			// Listen for changes to input value.
			desc.on( 'input propertychange paste', function() {
				var descLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{ 'descLength': descLength }] );
			});
			desc.trigger( 'bgseo-analysis', [{ 'descLength': desc.val().length }] );
		}
	};

	self = BOLDGRID.SEO.ContentAnalysis;

})( jQuery );

BOLDGRID.SEO.ContentAnalysis.init();
