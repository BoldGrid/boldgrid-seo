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
			// regex tested : https://regex101.com/r/vHAwas/2
			wordsRegExp: /.+?\s+/g,
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
