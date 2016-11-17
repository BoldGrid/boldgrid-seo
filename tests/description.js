describe( 'Gets the description selector.', function() {

	sandbox( '<textarea name="butterbean_boldgrid_seo_setting_bgseo_description" id="boldgrid-seo-field-meta_description" placeholder="The Write Stuff&nbsp;fdsfds&nbsp; A Better Copywriting Service &nbsp; The concept for my company was a team effort." class="widefat">testing</textarea>' );

	it( 'Uses the description field\'s selector.', function() {
		var description = BOLDGRID.SEO.Description.getDescription();
		expect( description.selector ).toBe( '#boldgrid-seo-field-meta_description' );
	});

	it( 'Finds the SEO Description correctly.', function() {
		var description = BOLDGRID.SEO.Description.getDescription();
		expect( description.val() ).toBe( 'testing' );
	});
});

describe( 'api.Description.descriptionScore() : Retrieves the description\'s status and message based on length.', function() {

	sandbox( '<textarea name="butterbean_boldgrid_seo_setting_bgseo_description" id="boldgrid-seo-field-meta_description" placeholder="The Write Stuff&nbsp;fdsfds&nbsp; A Better Copywriting Service &nbsp; The concept for my company was a team effort." class="widefat">testing</textarea>' );

	it( 'Returns a message object.', function() {
		var descriptionLength, msg;

		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( _.isObject( msg ) ).toBeTruthy();
	});

	it( 'Has a \'status\' property.', function() {
		var descriptionLength, msg;

		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( msg.status ).toBeTruthy();
	});

	it( 'Has a \'msg\' property.', function() {
		var descriptionLength, msg;

		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( msg.msg ).toBeTruthy();
	});

	it( 'Returns red status for no description being entered.', function() {
		var description, descriptionLength, msg;

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 0 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 0 );
		expect( msg.status ).toBe( 'red' );
	});

	it( 'Returns red status for descriptions over 156 characters', function() {
		var description, descriptionLength, msg;

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 157 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 157 );
		expect( msg.status ).toBe( 'red' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 156 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 156 );
		expect( msg.status ).not.toBe( 'red' );
	});

	it( 'Returns green status for descriptions that are 125-156 characters', function() {
		var description, descriptionLength, msg;

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 125 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 125 );
		expect( msg.status ).toBe( 'green' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 124 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 124 );
		expect( msg.status ).not.toBe( 'green' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 156 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 156 );
		expect( msg.status ).toBe( 'green' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 157 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 157 );
		expect( msg.status ).not.toBe( 'green' );
	});

	it( 'Returns yellow status for descriptions that are 1-124 characters', function() {
		var description, descriptionLength, msg;

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 1 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 1 );
		expect( msg.status ).toBe( 'yellow' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 0 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 0 );
		expect( msg.status ).not.toBe( 'yellow' );
		expect( msg.status ).toBe( 'red' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 124 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 124 );
		expect( msg.status ).toBe( 'yellow' );

		description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 125 ) );
		descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
		msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

		expect( descriptionLength ).toBe( 125 );
		expect( msg.status ).not.toBe( 'yellow' );
		expect( msg.status ).toBe( 'green' );
	});

});
