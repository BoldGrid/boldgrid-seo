( function ( $ ) {

	'use strict';

	/**
	 * Registers dashboard display as control.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_control( 'dashboard', {
		// Wrapper element for the control.
		tagName : 'div',

		// Custom attributes for the control wrapper.
		attributes : function() {
			return {
				'id'    : 'butterbean-control-' + this.model.get( 'name' ),
				'class' : 'butterbean-control butterbean-control-' + this.model.get( 'type' )
			};
		},
		initialize : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );

			var type = this.model.get( 'type' );

			this.bgseo_template = wp.template( 'butterbean-control-dashboard' );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},
		getAnalysis: function( e, report ) {
			this.model.set( report );
		},

		// Renders the control template.
		render : function() {
			// Only render template if model is active.
			if ( this.model.get( 'active' ) )
				this.el.innerHTML = this.bgseo_template( this.model.toJSON() );
			return this;
		},
	});

})( jQuery );

( function ( $ ) {

	'use strict';

	/**
	 * Registers the keywords display as a control.
	 *
	 * @since 1.4
	 */
	butterbean.views.register_control( 'keywords', {
		// Wrapper element for the control.
		tagName : 'div',

		// Custom attributes for the control wrapper.
		attributes : function() {
			return {
				'id'    : 'butterbean-control-' + this.model.get( 'name' ),
				'class' : 'butterbean-control butterbean-control-' + this.model.get( 'type' )
			};
		},
		initialize : function() {
			$( window ).bind( 'bgseo-report', _.bind( this.getAnalysis, this ) );

			var type = this.model.get( 'type' );

			this.bgseo_template = wp.template( 'butterbean-control-keywords' );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},
		getAnalysis: function( e, report ) {
			this.model.set( report );
		},

		// Renders the control template.
		render : function() {
			// Only render template if model is active.
			if ( this.model.get( 'active' ) )
				this.el.innerHTML = this.bgseo_template( this.model.toJSON() );
			return this;
		},
	});

})( jQuery );

var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Admin.
	 *
	 * This is responsible for setting the counters for the SEO Title &
	 * Description tab.
	 *
	 * @since 1.2.1
	 */
	BOLDGRID.SEO.Admin = {

		/**
		 * Initialize Word Count.
		 *
		 * @since 1.2.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._setWordCounts();
			});
		},

		/**
		 * Get the word count of a metabox field.
		 *
		 * @since 1.2.1
		 *
		 * @param {Object} $element The element to apply the word counter to.
		 */
		wordCount : function( $element ) {
			var limit      = $element.attr( 'maxlength' ),
				$counter   = $( '<span />', {
					'class' : 'boldgrid-seo-meta-counter',
					'style' : 'font-weight: bold'
				}),
				$container = $( '<div />', {
					'class' : 'boldgrid-seo-meta-countdown boldgrid-seo-meta-extra',
					'html'  : ' characters left'
				});

			if ( limit ) {
				$element
					.removeAttr( 'maxlength' )
					.after( $container.prepend( $counter ) )
					.on( 'keyup focus' , function() {
						self.setCounter( $counter, $element, limit );
					});
			}

			self.setCounter( $counter, $element, limit );
		},

		/**
		 * Set the colors of the count to reflect ideal lengths.
		 *
		 * @since 1.2.1
		 *
		 * @param {Object} $counter New element to create for counter.
		 * @param {Object} $target Element to check the input value of.
		 * @param {Number} limit The maxlength of the input to calculate on.
		 */
		setCounter : function( $counter, $target, limit ) {
			var text  = $target.val(),
			    chars = text.length;

			$counter.html( limit - chars );

			if ( $target.context.id === 'boldgrid-seo-field-meta_description' ) {
				if ( chars > limit ) {
					$counter.css( { 'color' : 'red' } );
				} else if ( chars.isBetween( 0, 126 ) ) {
					$counter.css( { 'color' : 'goldenrod' } );
				} else if ( chars > 125 ) {
					$counter.css( { 'color' : 'limegreen' } );
				} else {
					$counter.css( { 'color' : 'black' } );
				}
			} else {
				if ( chars > limit ) {
					$counter.css( { 'color' : 'red' } );
				} else if ( chars.isBetween( 0, 30 ) ) {
					$counter.css( { 'color' : 'goldenrod' } );
				} else if ( chars > 29 ) {
					$counter.css( { 'color' : 'limegreen' } );
				} else {
					$counter.css( { 'color' : 'black' } );
				}
			}
		},

		/**
		 * Set the word counts for each field in the SEO Title & Description Tab.
		 *
		 * @since 1.2.1
		 */
		_setWordCounts : function() {
			// Apply our wordcount counter to the meta title and meta description textarea fields.
			$( '#boldgrid-seo-field-meta_title, #boldgrid-seo-field-meta_description' )
				.each( function() {
					self.wordCount( $( this ) );
				});
		},
	};

	self = BOLDGRID.SEO.Admin;

})( jQuery );

BOLDGRID.SEO.Admin.init();

( function ( $ ) {

	'use strict';

	var self, report = {};

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
				var content,
				    preview = $( '#preview-action > .preview.button' ).attr( 'href' );

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

				// Trigger the content analysis for the tinyMCE content.
				_.defer( function() {
					$( '#content' ).trigger( 'bgseo-analysis', [content] );
				});

				/**
				 * Only ajax for preview if permalink is available. This only
				 * impacts "New" page and posts.  To counter
				 * this we will disable the checks made until the content has had
				 * a chance to be updated. We will store the found headings minus
				 * the initial found headings in the content, so we know what the
				 * template has in use on the actual rendered page.
				 */
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
						_.extend( report, headings );

						// The rendered content stats.
						var renderedContent = {
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
			});
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
				var titleLength = $( '#boldgrid-seo-field-meta_title' ).val().length,
				    descriptionLength = $( '#boldgrid-seo-field-meta_description' ).val().length;

				// Sets default for SEO title analysis.
				report.title = {
					length : titleLength,
					lengthScore:  BOLDGRID.SEO.Title.titleScore( titleLength ),
					keywordUsage : BOLDGRID.SEO.Title.keywords(),
				};

				// Sets default for SEO Description analysis.
				report.description = {
					length : descriptionLength,
					lengthScore:  BOLDGRID.SEO.Description.descriptionScore( descriptionLength ),
					keywordUsage : BOLDGRID.SEO.Description.keywords(),
				};

				// Sets default for keyword usage in title analysis.
				report.keywordTitle = {
					lengthScore : BOLDGRID.SEO.Keywords.titleScore( BOLDGRID.SEO.Title.keywords() ),
				};

				// Sets default for keyword usage in description analysis.
				report.descriptionTitle = {
					lengthScore : BOLDGRID.SEO.Keywords.descriptionScore( BOLDGRID.SEO.Description.keywords() ),
				};

				// Sets default for index/noindex analysis.
				report.robotIndex = {
					lengthScore: BOLDGRID.SEO.Robots.indexScore(),
				};

				// Sets default for follow/nofollow analysis.
				report.robotFollow = {
					lengthScore: BOLDGRID.SEO.Robots.followScore(),
				};

				// Listen for event changes being triggered.
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

						// Set the heading counts and image count found in new content update.
						report.rawstatistics = {
							'h1Count': $( raw ).find( 'h1' ).length,
							'h2Count': $( raw ).find( 'h2' ).length,
							'h3Count': $( raw ).find( 'h3' ).length,
							imageCount: imgLength,
						};

						// Set the image use count and analysis found in new content update.
						report.image = {
							length : imgLength,
							lengthScore: BOLDGRID.SEO.ContentAnalysis.seoImageLengthScore( imgLength ),
						};

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
							_.extend( headings.h1, { lengthScore : BOLDGRID.SEO.Headings.score( headings.h1.length ) } );

							// Adds and updates the true heading count as the user modifies content.
							_.extend( report, headings );
						}
					}

					// Listen for changes to the actual text entered by user.
					if ( eventInfo.text ) {
						var customKeyword, content = eventInfo.text;

						// Add the text statistic recommended keywords.
						report.textstatistics = {
							recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
						};

						/**
						 * Only do this analysis if the Word Count is over 99
						 * words since most of the analysis results are going
						 * to be invalid or skewed by not having much usable
						 * content available.
						 */
						if ( report.wordCount > 99 ) {
							report.textstatistics = {
								gradeLevel  : BOLDGRID.SEO.Readability.gradeLevel( content ),
								keywordDensity : BOLDGRID.SEO.Keywords.keywordDensity( content, 'gads' ),
								recommendedKeywords : BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 ),
							};

							/**
							 * Adds the customKeyword that's obtained to the report.
							 * Note: This can contain the user inputted custom keyword,
							 * or it can contain the autogenerated recommended keyword
							 * that was found based on the user's content.
							 */
							_.extend( report.textstatistics, { customKeyword : BOLDGRID.SEO.Keywords.getKeyword() } );
						}
					}

					// Listen to changes to the SEO Title and update report.
					if ( eventInfo.titleLength ) {
						report.title.length = eventInfo.titleLength;
					}

					// Listen to changes to the SEO Description and update report.
					if ( eventInfo.descLength ) {
						report.description.length = eventInfo.descLength;
					}

					// Listen for changes to noindex/index and update report.
					if ( eventInfo.robotIndex ) {
						report.robotIndex = {
							lengthScore : eventInfo.robotIndex,
						};
					}

					// Listen for changes to nofollow/follow and update report.
					if ( eventInfo.robotFollow ) {
						report.robotFollow = {
							lengthScore : eventInfo.robotFollow,
						};
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
		getReport : function() {
			return report;
		},
	};

	self = BOLDGRID.SEO.TinyMCE;

})( jQuery );

BOLDGRID.SEO.TinyMCE.init();

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Content Analysis.
	 *
	 * This is responsible for general analysis of the user's content.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.ContentAnalysis = {

		/**
		 * Content Length Score.
		 *
		 * This is responsible for the user's content length scoring.  The content
		 * length for this method is based on the word count, and not character
		 * counts.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} contentLength The length of the content to provide score on.
		 *
		 * @returns {Object} msg Contains the status indicator color and message.
		 */
		seoContentLengthScore: function( contentLength ) {
			var msg = {};

			if ( contentLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.content.length.badEmpty,
				};
			}
			if ( contentLength.isBetween( 0, 199 ) ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.content.length.badShort,
				};
			}
			if ( contentLength.isBetween( 198, 300 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.content.length.ok,
				};
			}
			if ( contentLength > 299 ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.content.length.good,
				};
			}

			return msg;
		},

		/**
		 * Checks if user has any images in their content.
		 *
		 * This provides a status and message if the user has included an
		 * image in their content for their page/post running analysis.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} imageLength Count of images found within content.
		 *
		 * @returns {Object} msg Contains the status indicator color and message.
		 */
		seoImageLengthScore: function( imageLength ) {
			var msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.image.length.good,
			};
			if ( ! imageLength ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.image.length.bad,
				};
			}

			return msg;
		},
	};

	self = BOLDGRID.SEO.ContentAnalysis;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Description.
	 *
	 * This is responsible for the SEO Description Grading.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Description = {

		/**
		 * Initialize SEO Description Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._description();
			});
		},

		/**
		 * Sets up event listener for changes made to the SEO Description.
		 *
		 * Listens for changes being made to the SEO Description, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_description : function() {
			var desc = $( '#boldgrid-seo-field-meta_description' );
			// Listen for changes to input value.
			desc.on( 'input propertychange paste', _.debounce( function() {
				var descLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{ 'descLength': descLength }] );
			}, 1000 ) );
		},

		/**
		 * Gets score of the SEO Description.
		 *
		 * Checks the length provided and returns a score and status color
		 * for the SEO description.  This score is based on character count.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} descriptionLength Length of the user's SEO Description.
		 *
		 * @returns {Object} msg Contains status indicator color and message to update.
		 */
		descriptionScore : function( descriptionLength ) {
			var msg = {};

			if ( descriptionLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoDescription.length.badEmpty,
				};
			}
			if ( descriptionLength.isBetween( 0, 126 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoDescription.length.ok,
				};
			}
			if ( descriptionLength.isBetween( 125, 156 ) ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoDescription.length.good,
				};
			}
			if ( descriptionLength > 156 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoDescription.length.badLong,
				};
			}

			return msg;
		},
		keywords : function() {
			var keyword = BOLDGRID.SEO.Keywords.getKeyword(),
				description = $( '#boldgrid-seo-field-meta_description' ).val();
			return description.occurences( keyword );
		},
	};

	self = BOLDGRID.SEO.Description;

})( jQuery );

BOLDGRID.SEO.Description.init();

( function ( $ ) {

	'use strict';

	var self;

	BOLDGRID.SEO.Headings = {

		/**
		 * Initialize BoldGrid SEO Headings Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {

		},
		score : function( count ) {
			var msg = {
					status : 'green',
					msg : _bgseoContentAnalysis.headings.h1.good,
				};
			// If we have more than one H1 tag rendered.
			if ( count > 1 ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badMultiple,
				};
			}
			// If no H1 tag is present.
			if ( 0 === count ) {
				msg = {
					status : 'red',
					msg : _bgseoContentAnalysis.headings.h1.badEmpty,
				};
			}
			return msg;
		},
	};

	self = BOLDGRID.SEO.Headings;

})( jQuery );

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
		 * Initialize BoldGrid SEO Keyword Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._keywords();
			});
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
			var keyword = $( '#bgseo-custom-keyword' );

			// Listen for changes to input value.
			keyword.on( 'input propertychange paste', _.debounce( function() {
				var msg = {},
				    length = $( this ).val().length;

				msg = {
					title : self.keywordsInTitle(),
					description : self.keywordsInDescription(),
				};

				$( this ).trigger( 'bgseo-analysis', [{'keywords': msg}] );

			}, 1000 ) );
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
				if ( ! word || word.length < 3 || _bgseoContentAnalysis.stopWords.indexOf( word ) > -1 ) {
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

		/**
		 * Retrieves User's Custom SEO Keyword.
		 *
		 * If the user has entered in a custom keyword to run evaluation on,
		 * then we will retrieve this value instead of the automatically
		 * generated keyword recommendation.
		 *
		 * @since 1.3.1
		 *
		 * @returns {string} keyword Trimmed output of user supplied custom keyword.
		 */
		getCustomKeyword : function() {
			var keyword = $( '#bgseo-custom-keyword' ).val();
			// Trim the input since it's user input to be sure there's no spaces.
			keyword = $.trim( keyword );

			return keyword;
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
			    report = BOLDGRID.SEO.TinyMCE.getReport();
			if ( report.wordCount > 99 ) {
				if ( self.getCustomKeyword().length ) {
					customKeyword = self.getCustomKeyword();
				} else {
					// Set customKeyword to recommended keyword search.
					customKeyword = report.textstatistics.recommendedKeywords[0][0];
				}
			}

			return customKeyword;
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
				//content : self.contentScore(),
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
			var msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.seoTitle.keywordUsage.good,
			};
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.seoTitle.keywordUsage.bad,
				};
			}
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
			var msg = {
				status: 'green',
				msg : _bgseoContentAnalysis.seoDescription.keywordUsage.good,
			};
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.seoDescription.keywordUsage.bad,
				};
			}
			if ( count > 1 ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.seoDescription.keywordUsage.ok,
				};
			}

			return msg;
		}
	};

	self = BOLDGRID.SEO.Keywords;

})( jQuery );

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
		 *
		 * @param {String} content The content to run the analysis on.
		 *
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
		 *
		 * @param {Number} grade The grade to evalute and return response for.
		 *
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

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Robots.
	 *
	 * This is responsible for the noindex and nofollow checkbox
	 * listeners, and returning status/scores for each.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Robots = {

		/**
		 * Initialize BoldGrid SEO Robots.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._index();
				self._follow();
			});
		},

		/**
		 * Sets up event listener for index/noindex radios.
		 *
		 * Listens for changes being made on the radios, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_index : function() {
			var index = $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index]' );
			// Listen for changes to input value.
			index.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotIndex': self.indexScore() }] );
			});
		},

		/**
		 * Gets score of index/noindex status.
		 *
		 * Checks if index/noindex is checked and returns appropriate
		 * status message and indicator.
		 *
		 * @since 1.3.1
		 * @returns {Object} Contains status indicator color and message to update.
		 */
		indexScore : function() {
			var msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.noIndex.good,
			};

			if ( $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index][value=noindex]' ).is( ':checked' ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.noIndex.bad,
				};
			}

			return msg;
		},

		/**
		 * Sets up event listener for follow/nofollow radios.
		 *
		 * Listens for changes being made on the radios, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_follow : function() {
			var index = $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_follow]' );
			// Listen for changes to input value.
			index.on( 'change', function() {
				$( this ).trigger( 'bgseo-analysis', [{ 'robotFollow': self.followScore() }] );
			});
		},

		/**
		 * Gets score of follow/nofollow status.
		 *
		 * Checks if follow or nofollow is checked, and returns appropriate
		 * status message and indicator.
		 *
		 * @since 1.3.1
		 * @returns {Object} Contains status indicator color and message to update.
		 */
		followScore : function() {
			var msg = {
				status: 'green',
				msg: _bgseoContentAnalysis.noFollow.good,
			};

			if ( $( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_follow][value=nofollow]' ).is( ':checked' ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.noFollow.bad,
				};
			}

			return msg;
		},
	};

	self = BOLDGRID.SEO.Robots;

})( jQuery );

BOLDGRID.SEO.Robots.init();

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Title.
	 *
	 * This is responsible for the SEO Title Grading.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Title = {

		/**
		 * Initialize SEO Title Analysis.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self._title();
			});
		},

		/**
		 * Gets the SEO Title.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} title Contains wrapped set with BoldGrid SEO Title..
		 */
		getTitle : function() {
			var title = $( '#boldgrid-seo-field-meta_title' );
			return title;
		},

		/**
		 * Sets up event listener for changes made to the SEO Title.
		 *
		 * Listens for changes being made to the SEO Title, and then
		 * triggers the reporter to be updated with new status/score.
		 *
		 * @since 1.3.1
		 */
		_title: function() {
			var title = self.getTitle();
			// Listen for changes to input value.
			title.on( 'input propertychange paste', _.debounce( function() {
				var titleLength = $( this ).val().length;
				$( this ).trigger( 'bgseo-analysis', [{'titleLength': titleLength}] );
			}, 1000 ) );
		},

		/**
		 * Gets score of the SEO Title.
		 *
		 * Checks the length provided and returns a score for the SEO
		 * title.  This score is based on character count.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} titleLength The length of the title to generate score for.
		 *
		 * @returns {Object} msg Contains status indicator color and message to update.
		 */
		titleScore: function( titleLength ) {
			var msg = {};
			// No title entered.
			if ( titleLength === 0 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badEmpty,
				};
			}
			// Title is 0-30 characters.
			if ( titleLength.isBetween( 0, 31 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoTitle.length.ok,
				};
			}
			// Title is 30-70 characters.
			if ( titleLength.isBetween( 29, 71 ) ) {
				msg = {
					status: 'green',
					msg: _bgseoContentAnalysis.seoTitle.length.good,
				};
			}
			// Title is grater than 70 characters.
			if ( titleLength > 70 ) {
				msg = {
					status: 'red',
					msg: _bgseoContentAnalysis.seoTitle.length.badLong,
				};
			}

			return msg;
		},
		keywords : function() {
			var keyword = BOLDGRID.SEO.Keywords.getKeyword(),
			    title = BOLDGRID.SEO.Title.getTitle().val();
			return title.occurences( keyword );
		},
	};

	self = BOLDGRID.SEO.Title;

})( jQuery );

BOLDGRID.SEO.Title.init();

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Tooltips.
	 *
	 * This will add the neccessary functionality for tooltips to be displayed
	 * for each control we create and display.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Tooltips = {

		/**
		 * Initializes BoldGrid SEO Tooltips.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			$( document ).ready( function() {
				self.hideToolTips();
				self._enableTooltips();
				self._toggleTooltip();
			});
		},
		_toggleTooltip : function() {
			$( '.butterbean-label, .bgseo-tooltip' ).on( 'click', function( e ) {
				self.toggleTooltip( e );
			});
		},
		_enableTooltips : function() {
			var controls = $( '.butterbean-label' ).next( '.butterbean-description' ),
			    $tooltip = $( '<span />', {
					'class'         : 'bgseo-tooltip dashicons dashicons-editor-help',
					'aria-expanded' : 'false'
				});

			// If a description exists for any of the controls, add the tooltip.
			if ( controls.length ) {
				controls.prev().append( $tooltip );
			}
		},
		toggleTooltip : function( e ) {
			$( e.currentTarget ).next( '.butterbean-description' ).slideToggle();
		},
		hideToolTips : function() {
			$( '.butterbean-control .butterbean-description' ).hide();
		},
	};

	self = BOLDGRID.SEO.Tooltips;

})( jQuery );

BOLDGRID.SEO.Tooltips.init();

( function ( $ ) {

	'use strict';

	var self;

	/**
	 * BoldGrid SEO Util.
	 *
	 * This will contain any utility functions needed across
	 * all classes.
	 *
	 * @since 1.3.1
	 */
	BOLDGRID.SEO.Util = {

		/**
		 * Initialize Utilities.
		 *
		 * @since 1.3.1
		 */
		init : function () {

			/**
			 * Usage: ( n ).isBetween( min, max )
			 *
			 * Gives you bool response if number is within the minimum
			 * and maximum numbers specified for the range.
			 *
			 * @since 1.3.1
			 *
			 * @param {Number} min Minimum number in range to check.
			 * @param {Number} max Maximum number in range to check.
			 *
			 * @returns {bool} Number is/isn't within range passed in params.
			 */
			Number.prototype.isBetween = function( min, max ) {
				return this > min && this < max;
			};

			/** Function that count occurrences of a substring in a string;
			 * @param {String} string               The string
			 * @param {String} subString            The sub string to search for
			 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
			 */
			String.prototype.occurences = function( needle, allowOverlapping ) {

				needle += "";
				if ( needle.length <= 0 ) return ( this.length + 1 );

				var n = 0,
					pos = 0,
					step = allowOverlapping ? 1 : needle.length;

				while ( true ) {
					pos = this.indexOf( needle, pos );
					if ( pos >= 0 ) {
						++n;
						pos += step;
					} else break;
				}

				return n;
			};
		},
	};

	self = BOLDGRID.SEO.Util;

})( jQuery );

BOLDGRID.SEO.Util.init();

( function( $, counter ) {

	$( function() {

		var $content = $( '#content' ),
			$count = $( '#wp-word-count' ).find( '.word-count' ),
			prevCount = 0,
			contentEditor;

		function update() {
			var text, count;

			if ( ! contentEditor || contentEditor.isHidden() ) {
				text = $content.val();
			} else {
				text = contentEditor.getContent( { format: 'raw' } );
			}

			count = counter.count( text );

			if ( count !== prevCount ) {
				$content.trigger( 'bgseo-analysis', [{'count': count}]);
			}

			prevCount = count;
		}

		$( document ).on( 'tinymce-editor-init', function( event, editor ) {
			if ( editor.id !== 'content' ) {
				return;
			}

			contentEditor = editor;

			editor.on( 'nodechange keyup', _.debounce( update, 1000 ) );
		} );

		$content.on( 'input keyup', _.debounce( update, 1000 ) );

		update();

	} );

} )( jQuery, new wp.utils.WordCounter() );
