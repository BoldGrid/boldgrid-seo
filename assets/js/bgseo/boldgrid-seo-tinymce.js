( function ( $ ) {

	'use strict';

	var self, report = {
		bgseo_visibility : {},
		bgseo_dashboard : {},
		bgseo_keywords : {},
		bgseo_meta : {},
		rawstatistics : {},
		textstatistics : {},
	};

	/**
	 * BoldGrid TinyMCE Analysis.
	 *
	 * This is responsible for generating the actual reports
	 * displayed within the BoldGrid SEO Dashboard when the user
	 * is on a page or a post.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.TinyMCE = {

		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			self.onloadContent();
			self.generateReport();
			$( document ).ready( function() {
				self.editorChange();
			});
		},

		/**
		 * Runs actions on window load to prepare for analysis.
		 *
		 * This method gets the current editor in use by the user on the
		 * initial page load ( text editor or visual editor ), and also
		 * is responsible for creating the iframe preview of the page/post
		 * so we can get the raw html in use by the template/theme the user
		 * has activated.
		 *
		 * @since 1.3.1
		 */
		onloadContent: function() {
			var text,
				editor = $( '#content.wp-editor-area[aria-hidden=false]' );

			$( window ).on( 'load bgseo-media-inserted', function() {
				var content = self.getContent();

				// Get rendered page content from frontend site.
				self.getRenderedContent();

				// Trigger the content analysis for the tinyMCE content.
				_.defer( function() {
					$( '#content' ).trigger( 'bgseo-analysis', [content] );
				});
			});
		},

		getContent : function() {
			var content;
			// Get the content of the visual editor or text editor that's present.
			if ( tinymce.ActiveEditor ) {
				content = tinyMCE.get( wpActiveEditor ).getContent();
			} else {
				content = $( '#content' ).val();
				content = content.replace( /\r?\n|\r/g, '' );
			}

			// Stores raw and stripped down versions of the content for analysis.
			content = {
				'raw': content,
				'text': self.stripper( content.toLowerCase() ),
			};

			return content;
		},

		/**
		 * Only ajax for preview if permalink is available. This only
		 * impacts "New" page and posts.  To counter
		 * this we will disable the checks made until the content has had
		 * a chance to be updated. We will store the found headings minus
		 * the initial found headings in the content, so we know what the
		 * template has in use on the actual rendered page.
		 *
		 * @since 1.3.1
		 *
		 * @returns null No return.
		 */
		getRenderedContent : function() {
			var renderedContent, preview;

			// Get the preview url from WordPress.
			preview = $( '#preview-action > .preview.button' ).attr( 'href' );

			if ( $( '#sample-permalink' ).length ) {
				// Only run this once after the initial iframe has loaded to get current template stats.
				$.get( preview, function( renderedTemplate ) {
					var headings, h1, h2, $rendered;

					// The rendered page content.
					$rendered = $( renderedTemplate );

					// H1's that appear in rendered content.
					h1 = $rendered.find( 'h1' );
					// HS's that appear in rendered content.
					h2 = $rendered.find( 'h2' );

					headings = {
						h1 : {
							length : h1.length,
							text : BOLDGRID.SEO.Headings.getHeadingText( h1 ),
						},
						h2 : {
							length : h2.length,
							text : BOLDGRID.SEO.Headings.getHeadingText( h2 ),
						},
					};

					// Set initial headings count.
					_( report.bgseo_dashboard ).extend({
						headings : {
							count : headings,
							score : BOLDGRID.SEO.Headings.score( headings.h1.length ),
						},
					});
					// Update the keywordHeadings object.
					_( report.bgseo_keywords ).extend({
						keywordHeadings : {
							length : BOLDGRID.SEO.Headings.keywords({ count: headings }),
							score : BOLDGRID.SEO.Keywords.headingScore( BOLDGRID.SEO.Headings.keywords({ count: headings }) ),
						},
					});
					// The rendered content stats.
					renderedContent = {
						h1Count : h1.length - report.rawstatistics.h1Count,
						h1text : _( BOLDGRID.SEO.Headings.getHeadingText( h1 ) ).difference( report.rawstatistics.h1text ),
						h2Count : h2.length - report.rawstatistics.h2Count,
						h2text : _( BOLDGRID.SEO.Headings.getHeadingText( h2 ) ).difference( report.rawstatistics.h2text ),
					};

					// Add the rendered stats to our report for use later.
					_.extend( report, { rendered : renderedContent } );

					// Trigger the SEO report to rebuild in the template after initial stats are created.
					$( '#content' ).trigger( 'bgseo-report', [BOLDGRID.SEO.TinyMCE.getReport()] );

				}, 'html' );
			}
		},
		/**
		 * Listens for changes made in the text editor mode.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} text The new content to perform analysis on.
		 */
		editorChange: function() {
			var text, targetId;
			$( '#content.wp-editor-area' ).on( 'input propertychange paste nodechange', function() {
				targetId = $( this ).attr( 'id' );
				text = self.wpContent( targetId );
			});
			return text;
		},

		/**
		 * This gets the content from the TinyMCE Visual editor.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} text
		 */
		tmceChange: function( e ) {
			var text, targetId = e.target.id;
			text = self.wpContent( targetId );
			return text;
		},

		/**
		 * Checks which editor is the active editor.
		 *
		 * After checking the editor, it will obtain the content and trigger
		 * the report generation with the new user input.
		 *
		 * @since 1.3.1
		 */
		wpContent : function( targetId ) {
			var text = {};
			switch ( targetId ) {
				// Grab text from TinyMCE Editor.
				case 'tinymce' :
					// Only do this if page/post editor has TinyMCE as active editor.
					if ( tinymce.activeEditor )
						// Define text as the content of the current TinyMCE instance.
						text = tinyMCE.get( wpActiveEditor ).getContent();
					break;
				case 'content' :
					text = $( '#content' ).val();
					text = text.replace( /\r?\n|\r/g, '' );
					break;
			}
			text = {
				'raw': text,
				'text': self.stripper( text.toLowerCase() ),
			};

			$( '#content' ).trigger( 'bgseo-analysis', [text] );

		},

		/**
		 * Strips out unwanted html.
		 *
		 * This is helpful in removing the  remaining traces of HTML
		 * that is sometimes leftover to form our clean text output and
		 * run our text analysis on.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} The content with any remaining html removed.
		 */
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || " ";
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

				// Sets wordCount values in report object.
				if ( eventInfo.count ) {
					words = {
						length : eventInfo.count,
						score : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( eventInfo.count ),
					};
					if ( eventInfo.count === 0 ) {
						words = {
							length : 0,
							score : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( 0 ),
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
							h1text : BOLDGRID.SEO.Headings.getHeadingText( h1 ),
							h2Count : h2.length,
							h2text : BOLDGRID.SEO.Headings.getHeadingText( h2 ),
							imageCount: $( eventInfo.raw ).find( 'img' ).length,
						};
						// Set the heading counts and image count found in new content update.
						_( report.rawstatistics ).extend( headings );
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var customKeyword,
						    headingCount = BOLDGRID.SEO.Headings.getRealHeadingCount(),
						    content = eventInfo.text;

						// Set the default report items.
						_( report ).extend({

							bgseo_dashboard : {
								sectionScore: {},
								sectionStatus: {},
								image : {
									length : report.rawstatistics.imageCount,
									score: BOLDGRID.SEO.ContentAnalysis.seoImageLengthScore( report.rawstatistics.imageCount ),
								},
								headings : headingCount,
								wordCount: {
									score : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( report.bgseo_dashboard.wordCount.length ),
								}
							},

							bgseo_meta : {
								title : {
									length : titleLength,
									score:  BOLDGRID.SEO.Title.titleScore( titleLength ),
								},
								description : {
									length : descriptionLength,
									score:  BOLDGRID.SEO.Description.descriptionScore( descriptionLength ),
									keywordUsage : BOLDGRID.SEO.Description.keywords(),
								},
								titleKeywordUsage : {
									score : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
								},
								descKeywordUsage : {
									score : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
								},
								sectionScore: {},
								sectionStatus: {},
							},

							bgseo_visibility : {
								robotIndex : {
									score: BOLDGRID.SEO.Robots.indexScore(),
								},
								robotFollow : {
									score: BOLDGRID.SEO.Robots.followScore(),
								},
								sectionScore: {},
								sectionStatus: {},
							},

							bgseo_keywords : {
								keywordTitle : {
									score : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
								},
								keywordDescription : {
									score : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
								},
								keywordContent : {
									score : BOLDGRID.SEO.Keywords.contentScore( BOLDGRID.SEO.ContentAnalysis.keywords( content ) ),
								},
								keywordHeadings : {
									length : BOLDGRID.SEO.Headings.keywords( headingCount ),
									score : BOLDGRID.SEO.Keywords.headingScore( BOLDGRID.SEO.Headings.keywords( headingCount ) ),
								},
								sectionScore: {},
								sectionStatus: {},
							},

							textstatistics : {
								recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
							},

						});

						/**
						 * Only do this analysis if the Word Count is over 99
						 * words since most of the analysis results are going
						 * to be invalid or skewed by not having much usable
						 * content available.
						 */
						if ( report.bgseo_dashboard.wordCount.length > 99 ) {
							_( report.textstatistics ).extend({
								recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
							});
							_( report.bgseo_dashboard ).extend({
								gradeLevel  : BOLDGRID.SEO.Readability.gradeLevel( content ),
							});

							/**
							 * Adds the customKeyword that's obtained to the report.
							 * Note: This can contain the user inputted custom keyword,
							 * or it can contain the autogenerated recommended keyword
							 * that was found based on the user's content.
							 */
							_( report.textstatistics ).extend({
								customKeyword : BOLDGRID.SEO.Keywords.getKeyword(),
							});
							_( report.bgseo_keywords ).extend({
								customKeyword : BOLDGRID.SEO.Keywords.getKeyword(),
								keywordDensity : BOLDGRID.SEO.Keywords.keywordDensity( content, BOLDGRID.SEO.Keywords.getKeyword() ),
							});
						}
					}

					// Listen to changes to the SEO Title and update report.
					if ( eventInfo.titleLength ) {

						_( report.bgseo_meta.title ).extend({
							length : eventInfo.titleLength,
							score :  BOLDGRID.SEO.Title.titleScore( eventInfo.titleLength ),
						});

						_( report.bgseo_meta.titleKeywordUsage ).extend({
							score : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
						});

						_( report.bgseo_keywords.keywordTitle ).extend({
							score : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
						});
					}

					if ( eventInfo.keywords ) {
						_( report.bgseo_keywords ).extend({
							customKeyword : eventInfo.keywords.keyword,
						});

						$( '#content' ).trigger( 'bgseo-analysis', [ self.getContent() ] );
					}

					// Listen to changes to the SEO Description and update report.
					if ( eventInfo.descLength ) {

						_( report.bgseo_meta.description ).extend({
							length : eventInfo.descLength,
							score:  BOLDGRID.SEO.Description.descriptionScore( eventInfo.descLength ),
						});

						_( report.bgseo_meta.descKeywordUsage ).extend({
							score : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
						});

						_( report.bgseo_keywords.keywordDescription ).extend({
							score : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
						});
					}

					// Listen for changes to noindex/index and update report.
					if ( eventInfo.robotIndex ) {
						_( report.bgseo_visibility.robotIndex ).extend({
							score : eventInfo.robotIndex,
						});
					}

					// Listen for changes to nofollow/follow and update report.
					if ( eventInfo.robotFollow ) {
						_( report.bgseo_visibility.robotFollow ).extend({
							score : eventInfo.robotFollow,
						});
					}
				}

				// Send the final analysis to display the report.
				$( '#content' ).trigger( 'bgseo-report', [report] );
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
		getReport : function( key ) {
			var data = {};
			if ( _.isUndefined( key ) ) {
				data = report;
			} else {
				data = report[key];
			}

			return data;
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();
