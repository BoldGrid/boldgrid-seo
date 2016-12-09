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

	});

})( jQuery );
