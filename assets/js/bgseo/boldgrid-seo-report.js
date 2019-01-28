( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid Editor Content Analysis.
	 *
	 * This is responsible for generating the actual reports
	 * displayed within the BoldGrid SEO Dashboard when the user
	 * is on a page or a post.
	 *
	 * @since 1.3.1
	 */
	api.Report = {

		/**
		 * Initialize Content.
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
			self.generateReport();
		},

		/**
		 * Cache selectors
		 *
		 * @since 1.3.1
		 */
		getSettings : function() {
			self.settings = {
				title : $( '#boldgrid-seo-field-meta_title' ),
				description : $( '#boldgrid-seo-field-meta_description' )
			};
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
			if ( _.isUndefined( self.settings ) ) return;
			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var words, titleLength, descriptionLength;

				// Get length of title field.
				titleLength = self.settings.title.val().length;

				// Get length of description field.
				descriptionLength = self.settings.description.val().length;

				if ( eventInfo.words ) {
					_( report.textstatistics ).extend({
						recommendedKeywords : api.Keywords.recommendedKeywords( eventInfo.words, 1 ),
						customKeyword : api.Keywords.getKeyword(),
					});
				}

				// Listen for event changes being triggered.
				if ( eventInfo ) {
					// Listen for changes to raw HTML in editor.
					if ( eventInfo.raw ) {
						// Prepend eventInfo.raw to an empty div so that the find commands work correctly.
						var $raws = $( '<div></div>' ).prepend( eventInfo.raw ),
							h1 = $raws.find( 'h1' ),
							h2 = $raws.find( 'h2' ),
							headings = {};

						headings = {
							h1Count : h1.length,
							h1text : api.Headings.getHeadingText( h1 ),
							h2Count : h2.length,
							h2text : api.Headings.getHeadingText( h2 ),
							imageCount: $raws.find( 'img' ).length,
						};
						// Set the heading counts and image count found in new content update.
						_( report.rawstatistics ).extend( headings );
					}

					if ( eventInfo.keywords ) {
						_( report.bgseo_keywords ).extend({
							keywordPhrase: {
								length : api.Keywords.phraseLength( api.Keywords.settings.keyword.val() ),
								lengthScore : api.Keywords.keywordPhraseScore( api.Keywords.phraseLength( api.Keywords.settings.keyword.val() ) ),
							},
							keywordTitle : {
								lengthScore : api.Keywords.titleScore( api.Title.keywords() ),
							},
							keywordDescription : {
								lengthScore : api.Keywords.descriptionScore( api.Description.keywords() ),
							},
							keywordContent : {
								lengthScore : api.Keywords.contentScore( api.ContentAnalysis.keywords( api.Editor.ui.getContent().text ) ),
							},
							keywordHeadings : {
								length : api.Headings.keywords( api.Headings.getRealHeadingCount() ),
								lengthScore : api.Keywords.headingScore( api.Headings.keywords( api.Headings.getRealHeadingCount() ) ),
							},
							customKeyword : eventInfo.keywords.keyword,
						});
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var kw, headingCount = api.Headings.getRealHeadingCount(),
							content = eventInfo.text,
							raw = api.Editor.ui.getRawText();

							// Get length of title field.
							titleLength = self.settings.title.val().length;

							// Get length of description field.
							descriptionLength = self.settings.description.val().length;

							// Set the placeholder attribute once the keyword has been obtained.
							kw =  api.Keywords.recommendedKeywords( raw, 1 );
							if ( ! _.isUndefined( kw ) && ! _.isUndefined( kw[0] ) ) api.Keywords.setPlaceholder( kw[0][0] );

						// Set the default report items.
						_( report ).extend({
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

								keywordPhrase: {
									length : api.Keywords.phraseLength( api.Keywords.settings.keyword.val() ),
									lengthScore : api.Keywords.keywordPhraseScore( api.Keywords.phraseLength( api.Keywords.settings.keyword.val() ) ),
								},
								keywordTitle : {
									lengthScore : api.Keywords.titleScore( api.Title.keywords() ),
								},
								keywordDescription : {
									lengthScore : api.Keywords.descriptionScore( api.Description.keywords() ),
								},
								keywordContent : {
									lengthScore : api.Keywords.contentScore( api.ContentAnalysis.keywords( api.Editor.ui.getContent().text ) ),
								},
								keywordHeadings : {
									length : api.Headings.keywords( headingCount ),
									lengthScore : api.Keywords.headingScore( api.Headings.keywords( headingCount ) ),
								},
								image : {
									length : report.rawstatistics.imageCount,
									lengthScore : api.ContentAnalysis.seoImageLengthScore( report.rawstatistics.imageCount ),
								},
								headings : headingCount,
								wordCount : {
									length : api.Wordcount.count,
									lengthScore : api.ContentAnalysis.seoContentLengthScore( api.Wordcount.count ),
								},
								sectionScore: {},
								sectionStatus: {},
							},

							textstatistics : {
								recommendedKeywords : kw,
								recommendedCount : api.Keywords.getRecommendedCount( raw ),
								keywordDensity : api.Keywords.keywordDensity( content, api.Keywords.getKeyword() ),
							},

						});
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
						api.Editor.triggerAnalysis();
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
						api.Editor.triggerAnalysis();
					}

					// Listen for changes to noindex/index and update report.
					if ( eventInfo.robotIndex ) {
						_( report.bgseo_visibility.robotIndex ).extend({
							lengthScore : eventInfo.robotIndex,
						});
						api.Editor.triggerAnalysis();
					}

					// Listen for changes to nofollow/follow and update report.
					if ( eventInfo.robotFollow ) {
						_( report.bgseo_visibility.robotFollow ).extend({
							lengthScore : eventInfo.robotFollow,
						});
						api.Editor.triggerAnalysis();
					}
				}

				// Send the final analysis to display the report.
				api.Editor.element.trigger( 'bgseo-report', [ report ] );
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
