( function ( $ ) {

	// Generate a string of x length.
	function makeStr( len, char ) {
		return Array.prototype.join.call({ length : ( len || -1 ) + 1 }, char || 'x' );
	}

	describe( 'api.Title.onReady() : Sets event listeners and get selector cache.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<div id="butterbean-boldgrid_seo-section-bgseo_visibility" class="butterbean-section butterbean-section-default" aria-hidden="false"><div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div><div id="butterbean-control-bgseo_robots_follow" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Follow<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Having this set to follow means that search engines are able to count and follow where your links go to.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="follow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow" checked="checked">follow</label></li><li><label><input type="radio" value="nofollow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow">nofollow</label></li></ul></div><div id="butterbean-control-bgseo_canonical" class="butterbean-control butterbean-control-text"><label><span class="butterbean-label">Canonical Link<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">The canonical URL that this page should point to, leave it empty to default to the permalink.</span><input type="text" value="" name="butterbean_boldgrid_seo_setting_bgseo_canonical" class="widefat" placeholder="http://local.wordpress.dev/about-us-staging/"></label></div></div>' );

		it( 'Loads in $(document).ready().', function() {
			// Set document ready.
			BOLDGRID.SEO.Title.onReady();
			expect( BOLDGRID.SEO.Title.settings ).toBeDefined();
		});

		it( 'Calls _title on document ready initialize.', function() {
			var _title = spyOn( BOLDGRID.SEO.Title, '_title' );
			// Set document ready.
			BOLDGRID.SEO.Title.onReady();
			expect( _title ).toHaveBeenCalled();
		});

		it( 'Calls to setup settings/selector cache.', function() {
			var settings = spyOn( BOLDGRID.SEO.Title, 'getSettings' );
			// Set document ready.
			BOLDGRID.SEO.Title.onReady();
			expect( settings ).toHaveBeenCalled();
		});

		it( 'Loads selector cache stored in api.Title.settings.', function() {
			// Set document ready.
			BOLDGRID.SEO.Title.onReady();
			expect( BOLDGRID.SEO.Title.settings ).toBeDefined();
			expect( BOLDGRID.SEO.Title.settings.title.selector ).toBe( '#boldgrid-seo-field-meta_title' );
		});

	});

	describe( 'Gets the title selector.', function() {
		if ( typeof  sandbox == 'function' ) sandbox( '<input type="text" value="testing" name="butterbean_boldgrid_seo_setting_bgseo_title" id="boldgrid-seo-field-meta_title" placeholder="About Us - Splatter" class="widefat">' );
		it( 'Uses the title field\'s selector.', function() {
			// Setup onReady.
			BOLDGRID.SEO.Title.onReady();
			var title = BOLDGRID.SEO.Title.getTitle();
			expect( title.selector ).toBe( '#boldgrid-seo-field-meta_title' );
		});
		it( 'Finds the SEO Title correctly.', function() {
			var title = BOLDGRID.SEO.Title.getTitle();
			expect( title.val() ).toBe( $( '#boldgrid-seo-field-meta_title' ).val() );
		});
	});

	describe( 'Retrieves the title\'s status and message based on length.', function() {
		if ( typeof  sandbox == 'function' ) sandbox( '<input type="text" value="testing" name="butterbean_boldgrid_seo_setting_bgseo_title" id="boldgrid-seo-field-meta_title" placeholder="About Us - Splatter" class="widefat">' );
		it( 'Returns a message object.', function() {
			// Setup onReady.
			BOLDGRID.SEO.Title.onReady();
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

			title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 30 ) );
			titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
			msg = BOLDGRID.SEO.Title.titleScore( titleLength );

			expect( titleLength ).toBe( 30 );
			expect( msg.status ).toBe( 'green' );

			title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 29 ) );
			titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
			msg = BOLDGRID.SEO.Title.titleScore( titleLength );

			expect( titleLength ).toBe( 29 );
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

			title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 29 ) );
			titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
			msg = BOLDGRID.SEO.Title.titleScore( titleLength );

			expect( titleLength ).toBe( 29 );
			expect( msg.status ).toBe( 'yellow' );

			title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 30 ) );
			titleLength = BOLDGRID.SEO.Title.getTitle().val().length;
			msg = BOLDGRID.SEO.Title.titleScore( titleLength );

			expect( titleLength ).toBe( 30 );
			expect( msg.status ).not.toBe( 'yellow' );
		});
	});

	describe( 'api.Title.keywords() Tests', function() {
		if ( typeof  sandbox == 'function' ) sandbox( '<input type="text" value="testing xx" name="butterbean_boldgrid_seo_setting_bgseo_title" id="boldgrid-seo-field-meta_title" placeholder="About Us - Splatter" class="widefat">' );
		it( 'Returns a number.', function() {
			// Setup onReady.
			BOLDGRID.SEO.Title.onReady();
			var text, title, keywords, keyword;

			title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 50 ) );
			text = title.val();
			keyword = 'xx';
			keywords = BOLDGRID.SEO.Title.keywords( text, keyword );
			expect( keywords ).toEqual( jasmine.any( Number ) );
		});
		it( 'Gets the correct count of keywords in title', function() {
			var text, title, keywords, keyword;

			title = BOLDGRID.SEO.Title.getTitle().val( makeStr( 50 ) );
			text = title.val();
			keyword = 'xx';
			keywords = BOLDGRID.SEO.Title.keywords( text, keyword );
			expect( keywords ).toBe( 25 );
		});

		/**
			api.Keywords hasn't been added to tests yet.

			it( 'Gets the keyword if text is specified', function() {
				text = 'abcxxdefg';
				keyword = 'xx';
				keywords = BOLDGRID.SEO.Title.keywords( text );
				expect( keywords ).toBe( 1 );
			});
			it( 'Gets the title and keyword if no params are specified', function() {
				keyword = 'xx';
				keywords = BOLDGRID.SEO.Title.keywords();
				expect( keywords ).toBe( 1 );
			});
		**/
	});
})( jQuery );
