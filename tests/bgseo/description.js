( function ( $ ) {

	// Generate a string of x length.
	function makeStr( len, char ) {
		return Array.prototype.join.call({ length : ( len || -1 ) + 1 }, char || 'x' );
	}

	describe( 'api.Description.onReady() : Setup event listeners and get selector cache.', function() {

		if ( typeof  sandbox == 'function' ) if ( typeof  sandbox == 'function' ) sandbox( '<div id="butterbean-boldgrid_seo-section-bgseo_visibility" class="butterbean-section butterbean-section-default" aria-hidden="false"><div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div><div id="butterbean-control-bgseo_robots_follow" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Follow<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Having this set to follow means that search engines are able to count and follow where your links go to.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="follow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow" checked="checked">follow</label></li><li><label><input type="radio" value="nofollow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow">nofollow</label></li></ul></div><div id="butterbean-control-bgseo_canonical" class="butterbean-control butterbean-control-text"><label><span class="butterbean-label">Canonical Link<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">The canonical URL that this page should point to, leave it empty to default to the permalink.</span><input type="text" value="" name="butterbean_boldgrid_seo_setting_bgseo_canonical" class="widefat" placeholder="http://local.wordpress.dev/about-us-staging/"></label></div></div>' );

		it( 'Loads in $(document).ready().', function() {
			// Set document ready.
			BOLDGRID.SEO.Description.onReady();
			expect( BOLDGRID.SEO.Description.settings ).toBeDefined();
		});

		it( 'Calls _description on document ready initialize.', function() {
			var _description = spyOn( BOLDGRID.SEO.Description, '_description' );
			// Set document ready.
			BOLDGRID.SEO.Description.onReady();
			expect( _description ).toHaveBeenCalled();
		});

		it( 'Calls to setup settings/selector cache.', function() {
			var something = spyOn( BOLDGRID.SEO.Description, 'getSettings' );
			// Set document ready.
			BOLDGRID.SEO.Description.onReady();
			expect( something ).toHaveBeenCalled();
		});

		it( 'It loads api.Description selector cache stored in api.Description.settings.', function() {
			// Set document ready.
			BOLDGRID.SEO.Description.onReady();
			expect( BOLDGRID.SEO.Description.settings ).toBeDefined();
			expect( BOLDGRID.SEO.Description.settings.description.selector ).toBe( '#boldgrid-seo-field-meta_description' );
		});

	});

	describe( 'Gets the description selector.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<textarea name="butterbean_boldgrid_seo_setting_bgseo_description" id="boldgrid-seo-field-meta_description" placeholder="The Write Stuff&nbsp;fdsfds&nbsp; A Better Copywriting Service &nbsp; The concept for my company was a team effort." class="widefat">testing</textarea>' );

		it( 'Uses the description field\'s selector.', function() {
			BOLDGRID.SEO.Description.onReady();
			var description = BOLDGRID.SEO.Description.getDescription();
			expect( description.selector ).toBe( '#boldgrid-seo-field-meta_description' );
		});

		it( 'Finds the SEO Description correctly.', function() {
			var description = BOLDGRID.SEO.Description.getDescription();
			expect( description.val() ).toBe( $( '#boldgrid-seo-field-meta_description' ).val() );
		});
	});

	describe( 'api.Description.descriptionScore() : Retrieves the description\'s status and message based on length.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<textarea name="butterbean_boldgrid_seo_setting_bgseo_description" id="boldgrid-seo-field-meta_description" placeholder="The Write Stuff&nbsp;fdsfds&nbsp; A Better Copywriting Service &nbsp; The concept for my company was a team effort." class="widefat">testing</textarea>' );

		it( 'Returns a message object.', function() {
			// Setup on $( document ).ready()
			BOLDGRID.SEO.Description.onReady();
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

		it( 'Returns red status for descriptions over 300 characters', function() {
			var description, descriptionLength, msg;

			description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 301 ) );
			descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
			msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

			expect( descriptionLength ).toBe( 301 );
			expect( msg.status ).toBe( 'red' );

			description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 300 ) );
			descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
			msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

			expect( descriptionLength ).toBe( 300 );
			expect( msg.status ).not.toBe( 'red' );
		});

		it( 'Returns green status for descriptions that are 125-300 characters', function() {
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

			description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 300 ) );
			descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
			msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

			expect( descriptionLength ).toBe( 300 );
			expect( msg.status ).toBe( 'green' );

			description = BOLDGRID.SEO.Description.getDescription().val( makeStr( 301 ) );
			descriptionLength = BOLDGRID.SEO.Description.getDescription().val().length;
			msg = BOLDGRID.SEO.Description.descriptionScore( descriptionLength );

			expect( descriptionLength ).toBe( 301 );
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
})( jQuery );
