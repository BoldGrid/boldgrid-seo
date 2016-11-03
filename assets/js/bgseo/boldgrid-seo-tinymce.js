( function ( $ ) {

	'use strict';

	var self, report = {};

	BOLDGRID.SEO.TinyMCE = {
		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			self.onloadContent();
			self.generateReport();
			$( document ).ready( function() {
				self.editorChange();
			});
		},
		onloadContent: function() {
			var text,
				editor = $( '#content.wp-editor-area[aria-hidden=false]' );
			$( window ).on( 'load bgseo-media-inserted', function() {
				var content,
				    preview = $( '#preview-action > .preview.button' ).attr( 'href' ),
				    iframe = $( '<iframe />', {
				        'src'      : preview,
				        'id'       : 'bgseo-rendered',
				        'width'    : '0',
				        'height'   : '0',
				        'tabindex' : '-1',
				        'title'    : 'empty',
				        'class'    : 'hidden',
				        'role'     : 'presentation'
				    });

				if ( tinymce.ActiveEditor ) {
					content = tinyMCE.get( wpActiveEditor ).getContent();
				} else {
					content = $( '#content' ).val();
					content = content.replace( /\r?\n|\r/g, '' );
				}

				content = {
					'raw': content,
					'text': self.stripper( content.toLowerCase() ),
				};

				/**
				 * Load the iframe in the metabox if permalink is available.
				 * Otherwise we have to save and call back to load a temporary
				 * preview.  This only impacts "New" page and posts.  To counter
				 * this we will disable the checks made until the content has had
				 * a chance to be updated. We will store the found headings minus
				 * the initial found headings in the content, so we know what the
				 * template has in use on the actual rendered page.
				 */
				if ( $( '#sample-permalink' ).length ) {
					$( '#butterbean-manager-boldgrid_seo' ).prepend( iframe );
					$( '#bgseo-rendered' ).one( 'load', function() {
						var headings = {
							h1 : {
								length : $( this ).contents().find( 'h1' ).length,
							},
							h2 : {
								length : $( this ).contents().find( 'h2' ).length,
							},
							h3 : {
								length : $( this ).contents().find( 'h3' ).length,
							},
						};

						_.extend( headings.h1, { lengthScore : BOLDGRID.SEO.Headings.score( headings.h1.length ) } );

						// Set initial headings count.
						_.extend( report, headings );
						var renderedContent = {
							h1Count : $( this ).contents().find( 'h1' ).length - report.rawstatistics.h1Count,
							h2Count : $( this ).contents().find( 'h2' ).length - report.rawstatistics.h2Count,
							h3Count : $( this ).contents().find( 'h3' ).length - report.rawstatistics.h3Count,
						};
						_.extend( report, { rendered : renderedContent } );
						$( '#content' ).trigger( 'bgseo-report', [BOLDGRID.SEO.TinyMCE.getReport()] );
					});
				}
				_.defer( function() {
					$( '#content' ).trigger( 'bgseo-analysis', [content] );
				});
			});
		},
		editorChange: function() {
			var text, targetId;
			$( '#content.wp-editor-area' ).on( 'input propertychange paste nodechange', function() {
				targetId = $( this ).attr( 'id' );
				text = self.wpContent( targetId );
			});
			return text;
		},
		tmceChange: function( e ) {
			var text, targetId = e.target.id;
			text = self.wpContent( targetId );
			return text;
		},
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
		// Strip out remaining traces of HTML to form our cleanText output to scan
		stripper: function( html ) {
			var tmp;
			tmp = document.implementation.createHTMLDocument( 'New' ).body;
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || " ";
		},
		generateReport : function() {
			var words,
				count;

			$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
				var titleLength = $( '#boldgrid-seo-field-meta_title' ).val().length,
				    descriptionLength = $( '#boldgrid-seo-field-meta_description' ).val().length;

				report.title = {
					length : titleLength,
					lengthScore:  BOLDGRID.SEO.Title.titleScore( titleLength ),
					keywordUsage : BOLDGRID.SEO.Title.keywords(),
				};
				report.description = {
					length : descriptionLength,
					lengthScore:  BOLDGRID.SEO.Description.descriptionScore( descriptionLength ),
					keywordUsage : BOLDGRID.SEO.Description.keywords(),
				};

				report.keywordTitle = {
					lengthScore : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
				};

				report.descriptionTitle = {
					lengthScore : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
				};

				report.robotIndex = {
					lengthScore: BOLDGRID.SEO.Robots.indexScore(),
				};

				report.robotFollow = {
					lengthScore: BOLDGRID.SEO.Robots.followScore(),
				};

				if ( eventInfo ) {
					// Get WordPress' more acurate word counts.
					if ( ! _.isUndefined( eventInfo.count ) ) {
						report.wordCount = eventInfo.count;
						report.content = {
							length : eventInfo.count,
							lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( eventInfo.count ),
						};
					} else if ( eventInfo.count === 0 ) {
						report.content = {
							length : 0,
							lengthScore : BOLDGRID.SEO.ContentAnalysis.seoContentLengthScore( 0 ),
						};
					}

					// Listen for changes to raw HTML in editor.
					if ( eventInfo.raw ) {
						var headings = {},
						    raw = eventInfo.raw,
						    imgLength = $( raw ).find( 'img' ).length;

						report.rawstatistics = {
							'h1Count': $( raw ).find( 'h1' ).length,
							'h2Count': $( raw ).find( 'h2' ).length,
							'h3Count': $( raw ).find( 'h3' ).length,
							imageCount: imgLength,
						};
						report.image = {
							length : imgLength,
							lengthScore: BOLDGRID.SEO.ContentAnalysis.seoImageLengthScore( imgLength ),
						};
						if ( ! _.isUndefined( report.rendered ) ) {
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
							_.extend( headings.h1, { lengthScore : BOLDGRID.SEO.Headings.score( headings.h1.length ) } );
							// Adds and updates the true heading count as the user modifies content.
						}
						_.extend( report, headings );
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var customKeyword, content = eventInfo.text;

						report.textstatistics = {
							recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
						};

						if ( report.wordCount > 99 ) {
							report.textstatistics = {
								gradeLevel  : BOLDGRID.SEO.Readability.gradeLevel( content ),
								keywordDensity : BOLDGRID.SEO.Keywords.keywordDensity( content, 'gads' ),
								recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
							};

							// Extends the report.
							_.extend( report.textstatistics, { customKeyword : BOLDGRID.SEO.Keywords.getKeyword() } );
						}
					}

					// Listen to changes to the SEO Title.
					if ( eventInfo.titleLength ) {
						report.title.length = eventInfo.titleLength;
					}

					// Listen to changes to the SEO Description.
					if ( eventInfo.descLength ) {
						report.description.length = eventInfo.descLength;
					}

					if ( eventInfo.robotIndex ) {
						report.robotIndex = {
							lengthScore : eventInfo.robotIndex,
						};
					}

					if ( eventInfo.robotFollow ) {
						report.robotFollow = {
							lengthScore : eventInfo.robotFollow,
						};
					}
				}

				// Send analysis to display the report.
				$( '#content' ).trigger( 'bgseo-report', [report] );
			});
		},
		getReport : function() {
			return report;
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();
