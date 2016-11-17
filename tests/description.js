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
