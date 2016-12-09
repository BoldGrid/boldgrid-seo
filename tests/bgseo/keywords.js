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

})( jQuery );
