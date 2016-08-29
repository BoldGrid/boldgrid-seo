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
				//self.readingEase();
			});
		},
		readingEase: function( content ) {
			var result;
			result = textstatistics( content ).fleschKincaidReadingEase();
			return result;
		},
		gradeLevel: function( content ) {
			var grade, result= {};
			grade = textstatistics( content ).fleschKincaidGradeLevel();
			result = self.gradeAnalysis( grade );
			return result;
		},
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
	};

	self = BOLDGRID.SEO.ContentAnalysis;

})( jQuery );

BOLDGRID.SEO.ContentAnalysis.init();
