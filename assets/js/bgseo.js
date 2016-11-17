// Setup the BOLDGRID Object if it doesn't exist already.
var BOLDGRID = BOLDGRID || {};
// Create the BOLDGRID.SEO object.
BOLDGRID.SEO = {
	// Add the analysis report to the BOLDGRID.SEO object.
	report : {
		bgseo_visibility : {},
		bgseo_dashboard : {},
		bgseo_keywords : {},
		bgseo_meta : {},
		rawstatistics : {},
		textstatistics : {},
	},
};

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
			$( window ).bind( 'bgseo-report', _.bind( this.setAnalysis, this ) );

			this.bgseo_template = wp.template( 'butterbean-control-dashboard' );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},

		/**
		 * Get the results report for a given section.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} section The section name to get report for.
		 *
		 * @returns {Object} report The report for the section to display.
		 */
		results : function( data ) {
			var report = {};
			_.each( data, function( key ) {
				_.extend( report, key );
			});

			return report;
		},

		/**
		 * Gets the analysis for the section from the reporter.
		 *
		 * This is bound to the bgseo-report event, and will process
		 * the report and add only the analysis for the current section displayed.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The full report as it's updated by reporter.
		 */
		setAnalysis: function( e, report ) {
			var sectionScore,
			    section = this.model.get( 'section' ),
			    data = _.pick( report, section );

			// Get each of the analysis results to pass for template rendering.
			this.sectionReport = this.results( data );

			// Set the section's report in the model's attributes.
			this.model.set( 'analysis', this.sectionReport );

			// Get score for each section, and set a status for sections.
			_( report ).each( function( section ) {
				// sectionScore should be set.
				if ( ! _.isUndefined ( section.sectionScore ) ) {
					sectionScore = BOLDGRID.SEO.Sections.score( section );
					_( section ).extend( sectionScore );
				}
			});

			// Add the overview score to report.
			_( report.bgseo_dashboard ).extend({
				overview : {
					score : BOLDGRID.SEO.Dashboard.overviewScore( report ),
				},
			});

			// Get the status based on the overview score, and add to report.
			_( report.bgseo_dashboard.overview ).extend({
				status : BOLDGRID.SEO.Dashboard.overviewStatus( report.bgseo_dashboard.overview.score ),
			});

			// Set the nav highlight indicator for each section's tab.
			BOLDGRID.SEO.Sections.navHighlight( report );
			BOLDGRID.SEO.Sections.overviewStatus( report );
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
			$( window ).bind( 'bgseo-report', _.bind( this.setAnalysis, this ) );

			this.bgseo_template = wp.template( 'butterbean-control-keywords' );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},
		setAnalysis: function( e, report ) {
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

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Util.
	 *
	 * This will contain any utility functions needed across
	 * all classes.
	 *
	 * @since 1.3.1
	 */
	api.Util = {

		/**
		 * Initialize Utilities.
		 *
		 * @since 1.3.1
		 */
		init : function () {

			_.mixin({
				/**
				 * Return a copy of the object only containing the whitelisted properties.
				 * Nested properties are concatenated with dots notation.
				 *
				 * Example:
				 * a = { min: 0.5, max : 2.5 };
				 * _.modifyObject( a, function( item ){ return item * item; });
				 *
				 * Returns:
				 * { min: 0.25, max : 6.25 };
				 *
				 * @since 1.3.1
				 *
				 * @param obj
				 *
				 * @returns {Object} Modified object.
				 */
				modifyObject : function( object, iteratee ) {
					return _.object( _.map( object, function( value, key ) {
						return [ key, iteratee( value ) ];
					}));
				},

				/**
				 * Return a copy of the object only containing the whitelisted properties.
				 * Nested properties are concatenated with dots notation.
				 *
				 * Example:
				 * a = {a:'a', b:{c:'c', d:'d', e:'e'}};
				 * _.pickDeep(a, 'b.c','b.d')
				 *
				 * Returns:
				 * {b:{c:'c',d:'d'}}
				 *
				 * @since 1.3.1
				 *
				 * @param obj
				 *
				 * @returns {Object} copy Object containing only properties requested.
				 */
				pickDeep : function( obj ) {
					var copy = {},
						keys = Array.prototype.concat.apply( Array.prototype, Array.prototype.slice.call( arguments, 1 ) );

					this.each( keys, function( key ) {
						var subKeys = key.split( '.' );
						key = subKeys.shift();

						if ( key in obj ) {
							// pick nested properties
							if( subKeys.length > 0 ) {
								// extend property (if defined before)
								if( copy[ key ] ) {
									_.extend( copy[ key ], _.pickDeep( obj[ key ], subKeys.join( '.' ) ) );
								}
								else {
									copy[ key ] = _.pickDeep( obj[ key ], subKeys.join( '.' ) );
								}
							}
							else {
								copy[ key ] = obj[ key ];
							}
						}
					});

					return copy;
				},
			});

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
			if ( ! Number.prototype.isBetween ) {
				Number.prototype.isBetween = function( min, max ) {
					if ( _.isUndefined( min ) ) min = 0;
					if ( _.isUndefined( max ) ) max = 0;
					var newMax = Math.max( min, max );
					var newMin = Math.min( min, max );
					return this > newMin && this < newMax;
				};
			}

			/**
			 * Usage: ( n ).rounded( digits )
			 *
			 * Rounds a number to the closest decimal you specify.
			 *
			 * @since 1.3.1
			 *
			 * @param {Number} number Number to round.
			 * @param {Number} digits how many decimal places to round to.
			 *
			 * @returns {Number} rounded The number rounded to specified digits.
			 */
			if ( ! Number.prototype.rounded ) {
				Number.prototype.rounded = function( digits ) {

					if ( _.isUndefined( digits ) ) digits = 0;

					var multiple = Math.pow( 10, digits );
					var rounded = Math.round( this * multiple ) / multiple;

					return rounded;
				};
			}

			if ( ! String.prototype.printf ) {
				String.prototype.printf = function() {
					var newStr = this, i = 0;
					while ( /%s/.test( newStr ) ){
						newStr = newStr.replace( "%s", arguments[i++] );
					}

					return newStr;
				};
			}

			/**
			 * Function that counts occurrences of a substring in a string;
			 *
			 * @param {String} string               The string
			 * @param {String} subString            The sub string to search for
			 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
			 *
			 * @returns {Number} n The number of times a substring appears in a string.
			 */
			if ( ! String.prototype.occurences ) {
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
			}
		},
	};

	self = api.Util;

})( jQuery );

( function() {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;

	api.Words = {

		init : function( settings ) {
			var key,
				shortcodes;

			if ( settings ) {
				for ( key in settings ) {
					if ( settings.hasOwnProperty( key ) ) {
						self.settings[ key ] = settings[ key ];
					}
				}
			}

			shortcodes = self.settings.l10n.shortcodes;

			if ( shortcodes && shortcodes.length ) {
				self.settings.shortcodesRegExp = new RegExp( '\\[\\/?(?:' + shortcodes.join( '|' ) + ')[^\\]]*?\\]', 'g' );
			}
		},

		settings : {
			HTMLRegExp: /<\/?[a-z][^>]*?>/gi,
			HTMLcommentRegExp: /<!--[\s\S]*?-->/g,
			spaceRegExp: /&nbsp;|&#160;/gi,
			HTMLEntityRegExp: /&\S+?;/g,
			connectorRegExp: /--|\u2014/g,
			removeRegExp: new RegExp( [
				'[',
					// Basic Latin (extract)
					'\u0021-\u0040\u005B-\u0060\u007B-\u007E',
					// Latin-1 Supplement (extract)
					'\u0080-\u00BF\u00D7\u00F7',
					// General Punctuation
					// Superscripts and Subscripts
					// Currency Symbols
					// Combining Diacritical Marks for Symbols
					// Letterlike Symbols
					// Number Forms
					// Arrows
					// Mathematical Operators
					// Miscellaneous Technical
					// Control Pictures
					// Optical Character Recognition
					// Enclosed Alphanumerics
					// Box Drawing
					// Block Elements
					// Geometric Shapes
					// Miscellaneous Symbols
					// Dingbats
					// Miscellaneous Mathematical Symbols-A
					// Supplemental Arrows-A
					// Braille Patterns
					// Supplemental Arrows-B
					// Miscellaneous Mathematical Symbols-B
					// Supplemental Mathematical Operators
					// Miscellaneous Symbols and Arrows
					'\u2000-\u2BFF',
					// Supplemental Punctuation
					'\u2E00-\u2E7F',
				']'
			].join( '' ), 'g' ),
			astralRegExp: /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
			// regex tested : https://regex101.com/r/vHAwas/1
			wordsRegExp: /.+?\S\s+/g,
			characters_excluding_spacesRegExp: /\S/g,
			characters_including_spacesRegExp: /[^\f\n\r\t\v\u00AD\u2028\u2029]/g,
			l10n: window.wordCountL10n || {}
		},

		words : function( text, type ) {
			var count = 0;

			type = type || self.settings.l10n.type;

			if ( type !== 'characters_excluding_spaces' && type !== 'characters_including_spaces' ) {
				type = 'words';
			}

			if ( text ) {
				text = text + '\n';

				text = text.replace( self.settings.HTMLRegExp, '\n' );
				text = text.replace( self.settings.HTMLcommentRegExp, '' );

				if ( self.settings.shortcodesRegExp ) {
					text = text.replace( self.settings.shortcodesRegExp, '\n' );
				}

				text = text.replace( self.settings.spaceRegExp, ' ' );

				if ( type === 'words' ) {
					text = text.replace( self.settings.HTMLEntityRegExp, '' );
					text = text.replace( self.settings.connectorRegExp, ' ' );
					text = text.replace( self.settings.removeRegExp, '' );
				} else {
					text = text.replace( self.settings.HTMLEntityRegExp, 'a' );
					text = text.replace( self.settings.astralRegExp, 'a' );
				}
				text = text.match( self.settings[ type + 'RegExp' ] );

				if ( text ) {
					count = text;
				}
			}

			return count;
		},
	};

	self = api.Words;

} )();

( function( $, counter ) {

	$( function() {

		var $content = $( '#content' ),
			$count = $( '#wp-word-count' ).find( '.word-count' ),
			prevCount = 0,
			contentEditor,
			words;

		function update() {
			var text, count;

			if ( ! contentEditor || contentEditor.isHidden() ) {
				text = $content.val();
			} else {
				text = contentEditor.getContent( { format: 'raw' } );
			}

			count = counter.count( text );
			words = BOLDGRID.SEO.Words.words( text );

			if ( count !== prevCount ) {
				$content.trigger( 'bgseo-analysis', [{ words : words, count : count }] );
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
	api.TinyMCE = {

		/**
		 * Initialize TinyMCE Content.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			self.onloadContent();
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

		/**
		 * Gets the content from TinyMCE or the text editor for analysis.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} content Contains content in raw and text formats.
		 */
		getContent : function() {
			var content;
			// Get the content of the visual editor or text editor that's present.
			if ( tinymce.ActiveEditor ) {
				content = tinyMCE.get( wpActiveEditor ).getContent();
			} else {
				content = $( '#content' ).val();
				// Remove newlines and carriage returns.
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

					// The rendered content stats.
					renderedContent = {
						h1Count : h1.length - report.rawstatistics.h1Count,
						h1text : _.filter( api.Headings.getHeadingText( h1 ), function( obj ){
							return ! _.findWhere( report.rawstatistics.h1text, obj );
						}),
						h2Count : h2.length - report.rawstatistics.h2Count,
						h2text : _.filter( api.Headings.getHeadingText( h2 ), function( obj ){
							return ! _.findWhere( report.rawstatistics.h2text, obj );
						}),
					};

					// Add the rendered stats to our report for use later.
					_.extend( report, { rendered : renderedContent } );

					// Trigger the SEO report to rebuild in the template after initial stats are created.
					$( '#content' ).trigger( 'bgseo-analysis', [ self.getContent() ] );

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
			var text, targetId;

			targetId = e.target.id;
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

			// Trigger the text analysis for report.
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
	};

	self = api.TinyMCE;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Content Analysis.
	 *
	 * This is responsible for general analysis of the user's content.
	 *
	 * @since 1.3.1
	 */
	api.ContentAnalysis = {

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

		/**
		 * Get count of keywords used in content.
		 *
		 * This checks the content for occurences of the keyword used throughout.
		 *
		 * @since 1.3.1
		 *
		 * @param {string} content The content to search for the keyword in.
		 *
		 * @returns {Number} Count of times keyword appears in content.
		 */
		keywords : function( content ) {
			var keyword = api.Keywords.getKeyword();
			return content.occurences( keyword );
		},
	};

	self = api.ContentAnalysis;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Dashboard.
	 *
	 * This is responsible for any Dashboard section specific functionality.
	 *
	 * @since 1.3.1
	 */
	api.Dashboard = {

		/**
		 * This gets the overview score.
		 *
		 * Number is a percentage.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Number} The rounded percentage value for overall score.
		 */
		overviewScore : function( report ) {
			var max,
			    total = self.totalScore( report ),
			    sections = _.size( butterbean.models.sections );

				max = sections * 2;

			return ( total / max  * 100 ).rounded( 2 );
		},

		/**
		 * This gets the overview status.
		 *
		 * @since 1.3.1
		 *
		 * @param {Number} score The BoldGrid SEO overview status score.
		 *
		 * @returns {string} The status indicator color of the overall scoring.
		 */
		overviewStatus : function( score ) {
			var status;

			// Default overview status.
			status = 'green';

			// If status is below 40%.
			if ( score < 40 ) {
				status = 'red';
			}

			// Status is 40% - 75%.
			if ( score.isBetween( 39, 76 ) ) {
				status = 'yellow';
			}

			return status;
		},

		/**
		 * Get the combined statuses for each section in BoldGrid SEO metabox.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Object} status The combined statuses for all sections.
		 */
		getStatuses : function( report ) {
			var status = {};

			_.each( butterbean.models.sections, function( section ) {
				var score, name = section.get( 'name' );
				score = report[name].sectionStatus;
				status[name] = score;
				_( status[name] ).extend( score );
			});

			return status;
		},

		/**
		 * Assigns numbers to represent the statuses.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Object} score The numerical values based on status rank.
		 */
		assignNumbers : function( report ) {
			var score, statuses;

			statuses = self.getStatuses( report );

			// Map strings into score values.
			score = _.mapObject( statuses, function( status ) {
				var score;

				if ( status === 'red' ) score = 0;
				if ( status === 'yellow' ) score = 1;
				if ( status === 'green' ) score = 2;

				return score;
			});

			return score;
		},

		/**
		 * Combines all the status scores into a final sum.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} report The BoldGrid SEO Analysis report.
		 *
		 * @returns {Object} total The total overall numerical value for statuses.
		 */
		totalScore : function( report ) {
			var total, statuses = self.assignNumbers( report );

			total = _( statuses ).reduce( function( initial, number ) {
				return initial + number;
			}, 0 );

			return total;
		}
	};

	self = api.Dashboard;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Description.
	 *
	 * This is responsible for the SEO Description Grading.
	 *
	 * @since 1.3.1
	 */
	api.Description = {

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
			var keyword = api.Keywords.getKeyword(),
				description = $( '#boldgrid-seo-field-meta_description' ).val();
			return description.occurences( keyword );
		},
	};

	self = api.Description;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	api.Headings = {

		/**
		 * Initialize BoldGrid SEO Headings Analysis.
		 *
		 * @since 1.3.1
		 */
		score : function( count ) {
			var msg;

			// Set default message for h1 headings score.
			msg = {
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

		/**
		 * Gets count of how many times keywords appear in headings.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} headings The headings count object to check against.
		 *
		 * @returns {Number} How many times the keyword appears in the headings.
		 */
		keywords : function( headings ) {
			var found = { length : 0 },
			    keyword = api.Keywords.getKeyword();

			// If not passing in headings, attempt to find default headings.
			if ( _.isUndefined( headings ) ) {
				headings = { count : self.getRealHeadingCount() };
			}

			// Don't process report item if headings are empty.
			if ( _.isEmpty( headings ) ) return;
			// Get the count.
			_( headings.count ).each( function( value, key ) {
				var text = value.text;
				// Add to the found object for total occurences found for keyword in headings.
				_( text ).each( function( item ) {
					found.length =  Number( found.length ) + Number( item.heading.occurences( keyword ) * item.count );
				});
			});

			return found.length;
		},

		/**
		 * Get the text inside of headings.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} selectors jQuery wrapped selector object.
		 *
		 * @returns {Array} headingText Contains each selectors' text.
		 */
		getHeadingText : function( selectors ) {
			var headingText = {};

			headingText = _.countBy( selectors, function( value, key ) {
				return $.trim( $( value ).text().toLowerCase() );
			});
			headingText = _.map( headingText, function( value, key ) {
				return _( headingText ).has({ heading : key, count : value }) ? false : {
					heading : key,
					count : value,
				};
			});

			return headingText;
		},

		/**
		 * Gets the actual headings count based on the rendered page and the content.
		 *
		 * This only needs to be fired if the rendered report
		 * data is available for analysis.  The calculations take
		 * into account the template in use for the page/post and
		 * are stored earlier on in the load process when the user
		 * first enters the editor.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} headings Count of H1, H2, and H3 tags used for page/post.
		 */
		getRealHeadingCount : function() {
			var headings = {};

			// Only get this score if rendered content score has been provided.
			if ( ! _.isUndefined( report.rendered ) ) {
				// Stores the heading coutns for h1-h3 for later analysis.
				headings = {
					count: {
						h1 : {
							length : report.rendered.h1Count + report.rawstatistics.h1Count,
							text : _( report.rendered.h1text ).union( report.rawstatistics.h1text ),
						},
						h2 : {
							length : report.rendered.h2Count + report.rawstatistics.h2Count,
							text : _( report.rendered.h2text ).union( report.rawstatistics.h2text ),
						},
					},
				};
				// Add the score of H1 presence to the headings object.
				_( headings ).extend({
					lengthScore : self.score( headings.count.h1.length ),
				});
			} else {
				headings = self.getContentHeadings();
			}

			return headings;
		},

		/**
		 * Get the headings that exist in the raw content.
		 *
		 * This will get the content and check if any h1s or
		 * h2s exist in the raw markup.  If they are present, it will
		 * update the report with new count information and text.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Object} headings Counts of h1 and h2 tags in content.
		 */
		getContentHeadings : function() {
			var headings, h1s, h2s, content;

			// Set default counts.
			headings = {
				count: {
					h1 : {
						length : 0,
						text : {},
					},
					h2 : {
						length : 0,
						text : {},
					},
				},
			};

			content = api.TinyMCE.getContent();

			h1s = $( content.raw ).find( 'h1' );
			h2s = $( content.raw ).find( 'h2' );

			// If no h1s or h2s are found return the defaults.
			if ( ! h1s.length && ! h2s.length ) return headings;

			headings = {
				count: {
					h1 : {
						length : h1s.length,
						text : self.getHeadingText( h1s ),
					},
					h2 : {
						length : h2s.length,
						text : self.getHeadingText( h2s ),
					},
				},
			};

			return headings;
		},
	};

	self = api.Headings;

})( jQuery );

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
					keywords : {
						title : {
							length : api.Title.keywords(),
							lengthScore : 0,
						},
						description : {
							length : api.Description.keywords(),
							lengthScore : 0,
						},
						keyword : $.trim( $( this ).val() ),
					},
				};

				$( this ).trigger( 'bgseo-analysis', [msg] );

			}, 1000 ) );
		},

		isKeywordSet : function() {
			return $( '#bgseo-custom-keyword' ).isFieldSet();
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
			wordCount = report.bgseo_dashboard.wordCount.length;
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
		 * @param {Array} words The words to search through.
		 * @param {Number} n How many keywords to return back.
		 *
		 * @returns {Array} result An array of n* most frequent keywords.
		 */
		recommendedKeywords: function( words, n ) {
			var positions = {},
			    wordCounts = [],
			    result;

			if ( _.isEmpty( words ) ) return;

			for ( var i = 0; i < words.length; i++ ) {
				var word = $.trim( words[i] ).toLowerCase();

				// Make sure word isn't in our stop words and is longer than 3 characters.
				if ( ! word || word.length < 3 || _bgseoContentAnalysis.stopWords.indexOf( word ) > -1 ) {
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
			    content = api.TinyMCE.getContent();

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
				markup = ! tinyMCE.activeEditor || tinyMCE.activeEditor.hidden ?
					api.Words.words( $content.val() ) :
					api.Words.words( tinyMCE.activeEditor.getContent({ format : 'raw' }) );
			}

			count = _.modifyObject( _bgseoContentAnalysis.keywords.recommendedCount, function( item ) {
				return Number( ( item / 100 ) * api.Words.words( markup ).length ).rounded( 0 );
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
			var msg, range;

			// Get the keyword range based on the content length.
			range = self.getRecommendedCount();

			// Keyword not used at all in content.
			if ( 0 === count ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.content.keywordUsage.bad,
				};
			}
			// Keyword used 1-2 times in the content.
			if ( count.isBetween( range.min - 1, range.max + 1 ) ) {
				msg = {
					status: 'green',
					msg : _bgseoContentAnalysis.content.keywordUsage.good,
				};
			}
			// Keyword used 1-2 times in the content.
			if ( count < range.min ) {
				msg = {
					status: 'yellow',
					msg : _bgseoContentAnalysis.content.keywordUsage.okShort,
				};
			}

			// Key word used more than 3 times in the content.
			if ( count > range.max ) {
				msg = {
					status: 'red',
					msg : _bgseoContentAnalysis.content.keywordUsage.okLong,
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
	};

	self = api.Keywords;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Readability.
	 *
	 * This is responsible for the SEO Reading Score and Grading.
	 *
	 * @since 1.3.1
	 */
	api.Readability = {

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
			var scoreTranslated, description = {};

			// Grade is higher than 90.
			if ( grade > 90 ) {
				description = {
					'score' : grade,
					'gradeLevel' : '5th grade',
					'explanation': 'Very easy to read. Easily understood by an average 11-year-old student.',
					lengthScore : {
						'status' : 'green',
						'msg' : _bgseoContentAnalysis.readingEase.goodHigh,
					},
				};
			}
			// Grade is 80-90.
			if ( grade.isBetween( 79, 91 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '6th grade',
					'explanation': 'Easy to read. Conversational English for consumers.',
					lengthScore : {
						'status' : 'green',
						'msg' : _bgseoContentAnalysis.readingEase.goodMedHigh,
					},
				};
			}
			// Grade is 70-90.
			if ( grade.isBetween( 69, 81 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '7th grade',
					'explanation': 'Fairly easy to read.',
					lengthScore : {
						'status' : 'green',
						'msg' : _bgseoContentAnalysis.readingEase.goodMedLow,
					}
				};
			}
			// Grade is 60-70.
			if ( grade.isBetween( 59, 71 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '8th & 9th',
					'explanation': 'Plain English. Easily understood by 13- to 15-year-old students.',
					lengthScore : {
						'status' : 'green',
						'msg' : _bgseoContentAnalysis.readingEase.goodLow,
					},
				};
			}
			// Grade is 50-60.
			if ( grade.isBetween( 49, 61 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : '10th to 12th',
					'explanation': 'Fairly difficult to read.',
					lengthScore : {
						'status' : 'yellow',
						'msg' : _bgseoContentAnalysis.readingEase.ok,
					},
				};
			}
			// Grade is 30-50.
			if ( grade.isBetween( 29, 51 ) ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Student',
					'explanation': 'Difficult to read.',
					lengthScore : {
						'status' : 'red',
						'msg' : _bgseoContentAnalysis.readingEase.badHigh,
					},
				};
			}
			// Grade is less than 30.
			if ( grade < 30 ) {
				description = {
					'score'      : grade,
					'gradeLevel' : 'College Graduate',
					'explanation': 'Difficult to read.',
					lengthScore : {
						'status' : 'red',
						'msg' : _bgseoContentAnalysis.readingEase.badLow,
					},
				};
			}
			// Add translated score string to message.
			scoreTranslated = _bgseoContentAnalysis.readingEase.score.printf( grade ) + ' ';
			description.lengthScore.msg = description.lengthScore.msg.replace( /^/, scoreTranslated );

			return description;
		},
	};

	self = api.Readability;

})( jQuery );

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
								recommendedCount : api.Keywords.getRecommendedCount( raw ),
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
						$( '#content' ).trigger( 'bgseo-analysis', [ api.TinyMCE.getContent() ] );
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
						$( '#content' ).trigger( 'bgseo-analysis', [ api.TinyMCE.getContent() ] );
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

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Robots.
	 *
	 * This is responsible for the noindex and nofollow checkbox
	 * listeners, and returning status/scores for each.
	 *
	 * @since 1.3.1
	 */
	api.Robots = {

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
					status: 'red',
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

	self = api.Robots;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Sections.
	 *
	 * This is responsible for section related statuses and modifications.
	 *
	 * @since 1.3.1
	 */
	api.Sections = {

		/**
		 * Gets the status for a section.
		 *
		 * This will get the status based on the scores received for each
		 * section and return the status color as the report is updated.
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} sectionScores The scores for the section.
		 *
		 * @returns {string} status The status color to assign to the section.
		 */
		status : function( sectionScores ) {
			// Default status is set to green.
			var status = 'green';

			// Check if we have any red or yellow statuses and update as needed.
			if ( sectionScores.red > 0 ) {
				status = 'red';
			} else if ( sectionScores.yellow > 0 ) {
				status = 'yellow';
			}

			return status;
		},

		/**
		 * Gets the score and status of a section.
		 *
		 * This is responsible for getting the count of statuses that
		 * are set for each item in the report for a section.  It will
		 * return the data that is added to the report..
		 *
		 * @since 1.3.1
		 *
		 * @param {Object} section The section to get a score for.
		 *
		 * @returns {Object} data Contains the section status scores and section status.
		 */
		score : function( section ) {

			var sectionScores, score, data;

			// Set default counters for each status.
			sectionScores = { red: 0, green : 0, yellow : 0 };

			// Get the count of scores in object by status.
			score = _( section ).countBy( function( items ) {
				return  ! _.isUndefined( items.lengthScore ) && 'sectionScore' !== _.property( 'sectionScore' )( section ) ? items.lengthScore.status : '';
			});

			// Update the object with the new count.
			_( score ).each( function( value, key ) {
				if ( _.has( sectionScores , key ) ) {
					sectionScores[key] = value;
				}
			});

			// Update the section's score and status.
			data = {
				sectionScore : sectionScores,
				sectionStatus: self.status( sectionScores ),
			};

			return data;
		},

		removeStatus : function( selector ) {
			selector.removeClass( 'red yellow green' );
		},

		navHighlight : function( report ) {
			_.each( butterbean.models.sections, function( item ) {
				var selector,
				    manager = item.get( 'manager' ),
				    name = item.get( 'name' );

				selector = $( '[href="#butterbean-' + manager + '-section-' + name + '"]' ).closest( 'li' );
				self.removeStatus( selector );
				selector.addClass( report[name].sectionStatus );
			});
		},
		overviewStatus : function( report ) {
			var selector = $( "#butterbean-ui-boldgrid_seo.postbox > h2 > span:contains('BoldGrid SEO')" );
			self.removeStatus( selector );
			selector.addClass( 'overview-status ' + report.bgseo_dashboard.overview.status );
		}
	};

	self = api.Sections;

})( jQuery );

var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Title.
	 *
	 * This is responsible for the SEO Title Grading.
	 *
	 * @since 1.3.1
	 */
	api.Title = {

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

			// Title is 1-30 characters.
			if ( titleLength.isBetween( 0, 31 ) ) {
				msg = {
					status: 'yellow',
					msg: _bgseoContentAnalysis.seoTitle.length.ok,
				};
			}

			// Title is 30-70 characters.
			if ( titleLength.isBetween( 30, 71 ) ) {
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

		/**
		 * Get count of keywords used in the title.
		 *
		 * This checks the title for keyword frequency.
		 *
		 * @since 1.3.1
		 *
		 * @returns {Number} Count of times keyword appears in the SEO title.
		 */
		keywords : function() {
			var keyword = api.Keywords.getKeyword(),
			    title = self.getTitle().val();
			return title.occurences( keyword );
		},
	};

	self = api.Title;

})( jQuery );

( function ( $ ) {

	'use strict';

	var self, report, api;

	api = BOLDGRID.SEO;
	report = api.report;

	/**
	 * BoldGrid SEO Tooltips.
	 *
	 * This will add the neccessary functionality for tooltips to be displayed
	 * for each control we create and display.
	 *
	 * @since 1.3.1
	 */
	api.Tooltips = {

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

	self = api.Tooltips;

})( jQuery );

var BOLDGRID = BOLDGRID || {};
BOLDGRID.SEO = BOLDGRID.SEO || {};

( function ( $ ) {

	'use strict';

	var api;

	api = BOLDGRID.SEO;

	/**
	 * BoldGrid SEO Initialize.
	 *
	 * This initializes BoldGrid SEO.
	 *
	 * @since 1.3.1
	 */
	api.Init = {

		/**
		 * Initialize Utilities.
		 *
		 * @since 1.3.1
		 */
		init : function () {
			_.each( api, function( obj ) {
				return obj.init && obj.init();
			});
		},
	}.init();

})( jQuery );
