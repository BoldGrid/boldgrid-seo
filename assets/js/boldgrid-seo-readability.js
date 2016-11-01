( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Readability.
	 *
	 * This is responsible for the SEO Reading Score and Grading.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Readability = {

		/**
		 * Gets the Flesch Kincaid Grade based on the content.
		 *
		 * @since 1.3.1
		 * @returns {Number} result A number representing the grade of the content.
		 */
		gradeLevel : function( content ) {
			var grade, result = {};
			grade = textstatistics( content ).fleschKincaidReadingEase();
			result = self.gradeAnalysis( grade );
			return result;
		},

		/**
		 * Returns information about the grade for display.
		 *
		 * This will give back human readable explanations of the grading, so
		 * the user can make changes based on their score accurately.
		 *
		 * @since 1.3.1
		 * @returns {Object} description Contains status, explanation and associated grade level.
		 */
		gradeAnalysis : function( grade ) {
			var description = {};

			// Grade is higher than 90.
			if ( grade > 90 ) {
				description = {
					'lengthScore' : grade,
					'gradeLevel' : '5th grade',
					'explanation': 'Very easy to read. Easily understood by an average 11-year-old student.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodHigh,
				};
			}
			// Grade is 80-90.
			if ( grade.isBetween( 79, 91 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '6th grade',
					'explanation': 'Easy to read. Conversational English for consumers.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodMedHigh,
				};
			}
			// Grade is 70-90.
			if ( grade.isBetween( 69, 81 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '7th grade',
					'explanation': 'Fairly easy to read.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodMedLow,
				};
			}
			// Grade is 60-70.
			if ( grade.isBetween( 59, 71 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '8th & 9th',
					'explanation': 'Plain English. Easily understood by 13- to 15-year-old students.',
					'status' : 'green',
					'msg' : _bgseoContentAnalysis.readingEase.goodLow,
				};
			}
			// Grade is 50-60.
			if ( grade.isBetween( 49, 61 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '10th to 12th',
					'explanation': 'Fairly difficult to read.',
					'status' : 'yellow',
					'msg' : _bgseoContentAnalysis.readingEase.ok,
				};
			}
			// Grade is 30-50.
			if ( grade.isBetween( 29, 51 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Student',
					'explanation': 'Difficult to read.',
					'status' : 'red',
					'msg' : _bgseoContentAnalysis.readingEase.badHigh,
				};
			}
			// Grade is less than 30.
			if ( grade < 30 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Graduate',
					'explanation': 'Difficult to read.',
					'status' : 'red',
					'msg' : _bgseoContentAnalysis.readingEase.badLow,
				};
			}
			return description;
		},
	};

	self = BOLDGRID.SEO.Readability;

})( jQuery );

BOLDGRID.SEO.Readability.init();
