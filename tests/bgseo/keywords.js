( function ( $ ) {

	describe( 'Keywords are normalized.', function() {

		it( 'Keyword normalization works.', function() {
			// Set document ready.
			var word = BOLDGRID.SEO.Keywords.normalizeWords( "haven't" );
			expect( word ).not.toBe( "haven't" );
			expect( word ).toBe( 'havent' );
			word = BOLDGRID.SEO.Keywords.normalizeWords( "don't" );
			expect( word ).not.toBe( "don't" );
			expect( word ).toBe( 'dont' );
			word = BOLDGRID.SEO.Keywords.normalizeWords( "he'd" );
			expect( word ).toBe( 'hed' );
			expect( word ).not.toBe( "he'd" );
		});

		it( 'Recommended keyword is found in content snippet.', function() {
			// Set document ready.
			var word, content;
			content = "If you have any questions feel free to message us. We will get back to you as soon as we can. If you have any questions feel free to message us. We will get back to you as soon as we can.  havent havent havent havent havent havent havent havent";
			// Convert to array for recommended Keywords search.
			content = content.split( ' ' );
			word = BOLDGRID.SEO.Keywords.recommendedKeywords( content, 1 );
			// This appears more frequently.
			expect( word[0][0] ).not.toBe( "havent" );
			// This should be the actual found word despite havent used more.
			expect( word[0][0] ).toBe( 'questions' );
		});

	});

	describe( 'Keyword Phrase Word Count', function() {
		it( 'Returns 0 for no phrase entered', function() {
			var phraseLength, phrase;
			phrase = '';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 0 );
		});
		it( 'Detects a single word', function() {
			var phraseLength, phrase;
			phrase = 'words';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 1 );
		});
		it( 'Detects multiple words', function() {
			var phraseLength, phrase;
			phrase = 'multiple words';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 2 );
			phrase = 'multiple words test';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 3 );
			phrase = 'another longer test for the multiple words test';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 8 );
		});
		it( 'Doesn\'t trip up on multiple spaces between words.', function() {
			var phraseLength, phrase;
			phrase = 'two         words';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 2 );
		});
		it( 'Ignores trailing white space.', function() {
			var phraseLength, phrase;
			phrase = 'two words   ';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 2 );
		});
		it( 'Ignores leading white space.', function() {
			var phraseLength, phrase;
			phrase = '   two words';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 2 );
		});
		it( 'Ignores new lines.', function() {
			var phraseLength, phrase;
			phrase = '\n two words';
			phraseLength = BOLDGRID.SEO.Keywords.phraseLength( phrase );
			expect( phraseLength ).toBe( 2 );
		});
	});

	describe( 'Keyword Phrase Status Indicator.', function() {
		it( 'Shows red status indicator for no keywords entered.', function() {
			var msg;
			msg = BOLDGRID.SEO.Keywords.keywordPhraseScore( 0 );
			expect( msg.status ).toBe( 'red' );
		});
		it( 'Shows yellow status indicator for only single word entered.', function() {
			var msg;
			msg = BOLDGRID.SEO.Keywords.keywordPhraseScore( 1 );
			expect( msg.status ).toBe( 'yellow' );
		});
		it( 'Shows green status indicator if 2 or more words are entered.', function() {
			var msg;
			msg = BOLDGRID.SEO.Keywords.keywordPhraseScore( 2 );
			expect( msg.status ).toBe( 'green' );
			msg = BOLDGRID.SEO.Keywords.keywordPhraseScore( 3 );
			expect( msg.status ).toBe( 'green' );
			msg = BOLDGRID.SEO.Keywords.keywordPhraseScore( 8 );
			expect( msg.status ).toBe( 'green' );
		});
	});


})( jQuery );
