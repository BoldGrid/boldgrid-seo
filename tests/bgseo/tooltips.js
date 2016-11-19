( function ( $ ) {

	describe( 'api.Tooltips.onReady() : Setup event listeners and get selector cache.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div>' );

		it( 'Loads in $(document).ready().', function() {
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			expect( BOLDGRID.SEO.Tooltips.settings ).toBeDefined();
		});

		it( 'Calls _enableTooltips() on document ready initialize.', function() {
			var _enableTooltips = spyOn( BOLDGRID.SEO.Tooltips, '_enableTooltips' );
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			expect( _enableTooltips ).toHaveBeenCalled();
		});

		it( 'Calls _toggleTooltip() on document ready initialize.', function() {
			var _toggleTooltip = spyOn( BOLDGRID.SEO.Tooltips, '_toggleTooltip' );
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			expect( _toggleTooltip ).toHaveBeenCalled();
		});

		it( 'Calls to setup settings/selector cache.', function() {
			var getSettings = spyOn( BOLDGRID.SEO.Tooltips, 'getSettings' );
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			expect( getSettings ).toHaveBeenCalled();
		});

		it( 'Calls hideTooltips() on initialization.', function() {
			var hideTooltips = spyOn( BOLDGRID.SEO.Tooltips, 'hideTooltips' );
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			expect( hideTooltips ).toHaveBeenCalled();
		});

		it( 'It loads api.Robots selector cache stored in api.Robots.settings.', function() {
			expect( BOLDGRID.SEO.Tooltips.settings ).toBeDefined();
			settingsInitialized = BOLDGRID.SEO.Tooltips.settings;
			expect( settingsInitialized.description.selector ).toBe( '.butterbean-control .butterbean-description' );
		});

	});

	describe( 'api.Tooltips._enableTooltips() : Adds the tooltips to all controls that have a description field.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div>' );

		it( '_enableTooltips() was called and initalized.', function() {
			var _enableTooltips = spyOn( BOLDGRID.SEO.Tooltips, '_enableTooltips' );
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			// Method exists as a function.
			expect( typeof BOLDGRID.SEO.Tooltips._enableTooltips ).toBe( 'function' );
			// Method was called on initialization.
			expect( _enableTooltips ).toHaveBeenCalled();
		});

		it( 'Tooltips are enabled and added to DOM.', function() {
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			expect( $( '.bgseo-tooltip' ) ).toBeTruthy();
		});

	});

	describe( 'api.Tooltips.toggleTooltip() : Toggles a tooltip checks DOM for visibility.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div>' );

		it( 'toggleTooltip should be called when api.Tooltips.settings.onClick items are clicked.', function() {
			var toggleTooltip = spyOn( BOLDGRID.SEO.Tooltips, 'toggleTooltip' );
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			// Tooltip toggle should not have been called at this point.
			expect( toggleTooltip ).not.toHaveBeenCalled();
			// Trigger a click.
			BOLDGRID.SEO.Tooltips.settings.onClick.click();
			// Tooltip should now be toggled.
			expect( toggleTooltip ).toHaveBeenCalled();
		});

		it( 'Tooltip is hidden when page is loaded.', function() {
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			// Tooltip should be hidden by default.
			expect( $( '.butterbean-description' ).is( ':visible' ) ).toBeFalsy();
		});

		it( 'Tooltip is visible when clicked.', function() {
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			// Tooltip should be hidden by default.
			expect( $( '.butterbean-description' ).is( ':visible' ) ).toBeFalsy();
			// Trigger a click.
			BOLDGRID.SEO.Tooltips.settings.onClick.click();
			// Tooltip should be visible after being clicked open.
			expect( $( '.butterbean-description' ).is( ':visible' ) ).toBeTruthy();
		});

	});

	describe( 'api.Tooltips.hideTooltips() : Hides all tooltips - test checks DOM for visibility.', function() {

		if ( typeof  sandbox == 'function' ) sandbox( '<div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div>' );

		it( 'Tooltips were successfully hidden by api.Tooltips.hideTooltips().', function() {
			// Set document ready.
			BOLDGRID.SEO.Tooltips.onReady();
			// Tooltip should be hidden by default done on initalization by hideTooltips().
			expect( $( '.butterbean-description' ).is( ':visible' ) ).toBeFalsy();
			// Trigger a click.
			BOLDGRID.SEO.Tooltips.settings.onClick.click();
			// Tooltip should be visible after being clicked open.
			expect( $( '.butterbean-description' ).is( ':visible' ) ).toBeTruthy();
			// Trigger hiding all tooltips.
			BOLDGRID.SEO.Tooltips.hideTooltips();
			// Tooltips should now be hidden from view.
			expect( $( '.butterbean-description' ).is( ':visible' ) ).toBeFalsy();
		});

	});

})( jQuery );
