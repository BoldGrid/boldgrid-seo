describe( 'Gets the title selector.', function() {
	sandbox( '<input type="text" value="testing" name="butterbean_boldgrid_seo_setting_bgseo_title" id="boldgrid-seo-field-meta_title" placeholder="About Us - Splatter" class="widefat">' );
	it( 'Uses the title field\'s selector.', function() {
		var title = BOLDGRID.SEO.Title.getTitle();
		expect( title.selector ).toBe( '#boldgrid-seo-field-meta_title' );
	});
	it( 'Finds the SEO Title correctly.', function() {
		var title = BOLDGRID.SEO.Title.getTitle();
		expect( title.val() ).toBe( 'testing' );
	});
});

describe( 'Retrieves the title\'s status and message based on length.', function() {
	sandbox( '<input type="text" value="testing" name="butterbean_boldgrid_seo_setting_bgseo_title" id="boldgrid-seo-field-meta_title" placeholder="About Us - Splatter" class="widefat">' );
	it( 'Returns a message object.', function() {
		var titleLength, msg;

		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( _.isObject( msg ) ).toBeTruthy();
	});

	it( 'Returns red status for titles over 70 characters', function() {
		var title, titleLength, msg;

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 71 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 71 );
		expect( msg.status ).toBe( 'red' );
	});

	it( 'Returns red status for no title being entered.', function() {
		var title, titleLength, msg;

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 0 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 0 );
		expect( msg.status ).toBe( 'red' );
	});

	it( 'Returns green status for titles that are 31-70 characters', function() {
		var title, titleLength, msg;

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 31 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 31 );
		expect( msg.status ).toBe( 'green' );

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 30 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 30 );
		expect( msg.status ).not.toBe( 'green' );

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 70 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 70 );
		expect( msg.status ).toBe( 'green' );

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 71 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 71 );
		expect( msg.status ).not.toBe( 'green' );
	});

	it( 'Returns yellow status for titles that are 1-30 characters', function() {
		var title, titleLength, msg;

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 1 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 1 );
		expect( msg.status ).toBe( 'yellow' );

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 0 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 0 );
		expect( msg.status ).not.toBe( 'yellow' );

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 30 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 30 );
		expect( msg.status ).toBe( 'yellow' );

		title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 31 ) );
		titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
		msg = BOLDGRID.SEO.Title.titleScore( titleLength );

		expect( titleLength ).toBe( 31 );
		expect( msg.status ).not.toBe( 'yellow' );
	});
});
