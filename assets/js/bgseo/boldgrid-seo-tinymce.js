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
			var renderedContent, preview = $( '#preview-action > .preview.button' ).attr( 'href' );

			if ( $( '#sample-permalink' ).length ) {
				// Only run this once after the initial iframe has loaded to get current template stats.
				$.get( preview, function( renderedTemplate ) {
					var $rendered = $( renderedTemplate ),
						// Inital heading stats stored for later.
						headings = {
							h1 : {
								length : $rendered.find( 'h1' ).length,
							},
							h2 : {
								length : $rendered.find( 'h2' ).length,
							},
							h3 : {
								length : $rendered.find( 'h3' ).length,
							},
						};

					// Add the scoring for the h1 to report on.
					_.extend( headings.h1, { lengthScore : BOLDGRID.SEO.Headings.score( headings.h1.length ) } );

					// Set initial headings count.
					_.extend( report.bgseo_dashboard, headings );

					// The rendered content stats.
					renderedContent = {
						h1Count : $rendered.find( 'h1' ).length - report.rawstatistics.h1Count,
						h2Count : $rendered.find( 'h2' ).length - report.rawstatistics.h2Count,
						h3Count : $rendered.find( 'h3' ).length - report.rawstatistics.h3Count,
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
			var words,
				count;

			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var words, titleLength = $( '#boldgrid-seo-field-meta_title' ).val().length,
				    descriptionLength = $( '#boldgrid-seo-field-meta_description' ).val().length;

				// Sets wordCount values.
				if ( eventInfo.count ) {
					words = {
						length : eventInfo.count,
						lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( eventInfo.count ),
					};
					if ( eventInfo.count === 0 ) {
						words = {
							length : 0,
							lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( 0 ),
						};
					}
					_( report.bgseo_dashboard ).extend({
						content : words
					});
					_( report.bgseo_dashboard ).extend({
						wordCount : words,
					});
				}

				// Listen for event changes being triggered.
				if ( eventInfo ) {
					// Listen for changes to raw HTML in editor.
					if ( eventInfo.raw ) {
						var headings = {},
						    raw = eventInfo.raw;

						// Set the heading counts and image count found in new content update.
						_( report.rawstatistics ).extend({
							'h1Count': $( raw ).find( 'h1' ).length,
							'h2Count': $( raw ).find( 'h2' ).length,
							'h3Count': $( raw ).find( 'h3' ).length,
							imageCount: $( raw ).find( 'img' ).length,
						});

						/**
						 * This only needs to be fired if the rendered report
						 * data is available for analysis.  The calculations take
						 * into account the template in use for the page/post and
						 * are stored earlier on in the load process when the user
						 * first enters the editor.
						 */
						if ( ! _.isUndefined( report.rendered ) ) {
							// Stores the heading coutns for h1-h3 for later analysis.
							headings = {
								h1 : {
									length : report.rendered.h1Count + report.rawstatistics.h1Count,
								},
								h2 : {
									length : report.rendered.h2Count + report.rawstatistics.h2Count,
								},
								h3 : {
									length : report.rendered.h3Count + report.rawstatistics.h3Count,
								},
							};

							// Generates the scoring for h1 usage with status indicator and message.
							_( headings.h1 ).extend({
								lengthScore : BOLDGRID.SEO.Headings.score( headings.h1.length ),
							});

							// Adds and updates the true heading count as the user modifies content.
							_( report.bgseo_dashboard ).extend( headings );
						}
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var customKeyword, content = eventInfo.text;

						// Set the default report items.
						_( report ).extend({
							bgseo_dashboard : {
								sectionScore: {},
								sectionStatus: {},
								wordCount : {
									length : Number( $( '#wp-word-count .word-count' ).text() ),
									lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( report.bgseo_dashboard.wordCount.length ),
								},
								image : {
									length : report.rawstatistics.imageCount,
									lengthScore: BOLDGRID.SEO.ContentAnalysis.seoImageLengthScore( report.rawstatistics.imageCount ),
								},
							},
							bgseo_meta : {
								title : {
									length : titleLength,
									lengthScore:  BOLDGRID.SEO.Title.titleScore( titleLength ),
								},
								description : {
									length : descriptionLength,
									lengthScore:  BOLDGRID.SEO.Description.descriptionScore( descriptionLength ),
									keywordUsage : BOLDGRID.SEO.Description.keywords(),
								},
								titleKeywordUsage : {
									lengthScore : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
								},
								descKeywordUsage : {
									lengthScore : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
								},
								sectionScore: {},
								sectionStatus: {},
							},
							bgseo_visibility : {
								robotIndex : {
									lengthScore: BOLDGRID.SEO.Robots.indexScore(),
								},
								robotFollow : {
									lengthScore: BOLDGRID.SEO.Robots.followScore(),
								},
								sectionScore: {},
								sectionStatus: {},
							},
							bgseo_keywords : {
								keywordTitle : {
									lengthScore : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
								},
								keywordDescription : {
									lengthScore : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
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
						report.bgseo_meta.title.length = eventInfo.titleLength;

						_( report.bgseo_meta.titleKeywordUsage ).extend({
							lengthScore : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
						});

						_( report.bgseo_keywords.keywordTitle ).extend({
							lengthScore : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
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
						report.bgseo_meta.description.length = eventInfo.descLength;
						_( report.bgseo_meta.descKeywordUsage ).extend({
							lengthScore : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
						});
						_( report.bgseo_keywords.keywordDescription ).extend({
							lengthScore : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
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
