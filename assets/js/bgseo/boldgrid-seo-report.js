( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid TinyMCE Analysis.
	 *
	 * This is responsible for generating the actual reports
	 * displayed within the BoldGrid SEO Dashboard when the user
	 * is on a page or a post.
	 *
	 * @since 1.3.1
	 */
	api.Report = {

		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			self.generateReport();
		},

		/**
		 * Generate the Report based on analysis done.
		 *
		 * This will generate a report object and then trigger the
		 * reporter event, so that the model is updated and changes
		 * are reflected live for the user in their SEO Dashboard.
		 *
		 * @since 1.3.1
		 */
		generateReport : function() {
			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var words, titleLength, descriptionLength;

				// Get length of title field.
				titleLength = $( '#boldgrid-seo-field-meta_title' ).val().length;

				// Get length of description field.
				descriptionLength = $( '#boldgrid-seo-field-meta_description' ).val().length;

				if ( eventInfo.words ) {
					_( report.textstatistics ).extend({
						recommendedKeywords : api.Keywords.recommendedKeywords( eventInfo.words, 1 ),
						customKeyword : api.Keywords.getKeyword(),
					});
				}

				// Sets wordCount values in report object.
				if ( eventInfo.count ) {
					words = {
						length : eventInfo.count,
						lengthScore : api.ContentAnalysis.seoContentLengthScore( eventInfo.count ),
					};
					if ( eventInfo.count === 0 ) {
						words = {
							length : 0,
							lengthScore : api.ContentAnalysis.seoContentLengthScore( 0 ),
						};
					}

					// Update the word count in the report.
					_( report.bgseo_dashboard ).extend({
						wordCount : words,
					});
				}
				// Set default wordCount first.
				_( report.bgseo_dashboard ).extend({
					wordCount: {
						length : Number( $( '#wp-word-count .word-count' ).text() ),
					},
				});
				// Listen for event changes being triggered.
				if ( eventInfo ) {
					// Listen for changes to raw HTML in editor.
					if ( eventInfo.raw ) {
						var h1 = $( eventInfo.raw ).find( 'h1' ),
						    h2 = $( eventInfo.raw).find( 'h2' ),
						    headings = {};

						headings = {
							h1Count : h1.length,
							h1text : api.Headings.getHeadingText( h1 ),
							h2Count : h2.length,
							h2text : api.Headings.getHeadingText( h2 ),
							imageCount: $( eventInfo.raw ).find( 'img' ).length,
						};
						// Set the heading counts and image count found in new content update.
						_( report.rawstatistics ).extend( headings );
					}

					if ( eventInfo.keywords ) {
						_( report.bgseo_keywords ).extend({
							customKeyword : eventInfo.keywords.keyword,
						});

						$( '#content' ).trigger( 'bgseo-analysis', [ api.TinyMCE.getContent() ] );
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var headingCount = api.Headings.getRealHeadingCount(),
						    content = eventInfo.text,
							raw = ! tinyMCE.activeEditor || tinyMCE.activeEditor.hidden ? api.Words.words( $content.val() ) : api.Words.words( tinyMCE.activeEditor.getContent({ format : 'raw' }) );

						// Set the default report items.
						_( report ).extend({

							bgseo_dashboard : {
								sectionScore : {},
								sectionStatus : {},
								image : {
									length : report.rawstatistics.imageCount,
									lengthScore : api.ContentAnalysis.seoImageLengthScore( report.rawstatistics.imageCount ),
								},
								headings : headingCount,
								wordCount : {
									lengthScore : api.ContentAnalysis.seoContentLengthScore( report.bgseo_dashboard.wordCount.length ),
								}
							},

							bgseo_meta : {
								title : {
									length : titleLength,
									lengthScore :  api.Title.titleScore( titleLength ),
								},
								description : {
									length : descriptionLength,
									lengthScore :  api.Description.descriptionScore( descriptionLength ),
									keywordUsage : api.Description.keywords(),
								},
								titleKeywordUsage : {
									lengthScore : api.Keywords.titleScore( api.Title.keywords() ),
								},
								descKeywordUsage : {
									lengthScore : api.Keywords.descriptionScore( api.Description.keywords() ),
								},
								sectionScore : {},
								sectionStatus : {},
							},

							bgseo_visibility : {
								robotIndex : {
									lengthScore: api.Robots.indexScore(),
								},
								robotFollow : {
									lengthScore: api.Robots.followScore(),
								},
								sectionScore : {},
								sectionStatus : {},
							},

							bgseo_keywords : {
								keywordTitle : {
									lengthScore : api.Keywords.titleScore( api.Title.keywords() ),
								},
								keywordDescription : {
									lengthScore : api.Keywords.descriptionScore( api.Description.keywords() ),
								},
								keywordContent : {
									lengthScore : api.Keywords.contentScore( api.ContentAnalysis.keywords( content ) ),
								},
								keywordHeadings : {
									length : api.Headings.keywords( headingCount ),
									lengthScore : api.Keywords.headingScore( api.Headings.keywords( headingCount ) ),
								},
								sectionScore: {},
								sectionStatus: {},
							},

							textstatistics : {
								recommendedKeywords : api.Keywords.recommendedKeywords( raw, 1 ),
								keywordDensity : api.Keywords.keywordDensity( content, api.Keywords.getKeyword() ),
							},

						});

						// Removing readability score for now. _( report.bgseo_dashboard ).extend({ gradeLevel  : api.Readability.gradeLevel( content ), });

					}

					// Listen to changes to the SEO Title and update report.
					if ( eventInfo.titleLength ) {

						_( report.bgseo_meta.title ).extend({
							length : eventInfo.titleLength,
							lengthScore :  api.Title.titleScore( eventInfo.titleLength ),
						});

						_( report.bgseo_meta.titleKeywordUsage ).extend({
							lengthScore : api.Keywords.titleScore( api.Title.keywords() ),
						});

						_( report.bgseo_keywords.keywordTitle ).extend({
							lengthScore : api.Keywords.titleScore( api.Title.keywords() ),
						});
					}

					// Listen to changes to the SEO Description and update report.
					if ( eventInfo.descLength ) {

						_( report.bgseo_meta.description ).extend({
							length : eventInfo.descLength,
							lengthScore:  api.Description.descriptionScore( eventInfo.descLength ),
						});

						_( report.bgseo_meta.descKeywordUsage ).extend({
							lengthScore : api.Keywords.descriptionScore( api.Description.keywords() ),
						});

						_( report.bgseo_keywords.keywordDescription ).extend({
							lengthScore : api.Keywords.descriptionScore( api.Description.keywords() ),
						});
					}

					// Listen for changes to noindex/index and update report.
					if ( eventInfo.robotIndex ) {
						_( report.bgseo_visibility.robotIndex ).extend({
							lengthScore : eventInfo.robotIndex,
						});
					}

					// Listen for changes to nofollow/follow and update report.
					if ( eventInfo.robotFollow ) {
						_( report.bgseo_visibility.robotFollow ).extend({
							lengthScore : eventInfo.robotFollow,
						});
					}
				}

				// Send the final analysis to display the report.
				$( '#content' ).trigger( 'bgseo-report', [ report ] );
			});
		},

		/**
		 * Get's the current report that's generated for output.
		 *
		 * This is used for debugging, and to also obtain the current report in
		 * other classes to perform scoring, analysis, and status indicator updates.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} report The report data that's currently displayed.
		 */
		get : function( key ) {
			var data = {};
			if ( _.isUndefined( key ) ) {
				data = report;
			} else {
				data = _.pickDeep( report, key );
			}

			return data;
		},
	};

	self = api.Report;

})( jQuery );
