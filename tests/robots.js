describe( 'api.Robots.onReady() : Setup event listeners and get selector cache.', function() {

	sandbox( '<div id="butterbean-boldgrid_seo-section-bgseo_visibility" class="butterbean-section butterbean-section-default" aria-hidden="false"><div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div><div id="butterbean-control-bgseo_robots_follow" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Follow<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Having this set to follow means that search engines are able to count and follow where your links go to.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="follow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow" checked="checked">follow</label></li><li><label><input type="radio" value="nofollow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow">nofollow</label></li></ul></div><div id="butterbean-control-bgseo_canonical" class="butterbean-control butterbean-control-text"><label><span class="butterbean-label">Canonical Link<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">The canonical URL that this page should point to, leave it empty to default to the permalink.</span><input type="text" value="" name="butterbean_boldgrid_seo_setting_bgseo_canonical" class="widefat" placeholder="http://local.wordpress.dev/about-us-staging/"></label></div></div>' );

	it( 'Loads in $(document).ready().', function() {
		expect( BOLDGRID.SEO.Robots.settings ).toBeUndefined();
		// Set document ready.
		BOLDGRID.SEO.Robots.onReady();
		expect( BOLDGRID.SEO.Robots.settings ).toBeDefined();
	});

	it( 'Calls _index on document ready initialize.', function() {
		var something = spyOn( BOLDGRID.SEO.Robots, '_index' );
		// Set document ready.
		BOLDGRID.SEO.Robots.onReady();
		expect( something ).toHaveBeenCalled();
	});

	it( 'Calls _follow on document ready initialize.', function() {
		var something = spyOn( BOLDGRID.SEO.Robots, '_follow' );
		// Set document ready.
		BOLDGRID.SEO.Robots.onReady();
		expect( something ).toHaveBeenCalled();
	});

	it( 'Calls to setup settings/selector cache.', function() {
		var something = spyOn( BOLDGRID.SEO.Robots, 'getSettings' );
		// Set document ready.
		BOLDGRID.SEO.Robots.onReady();
		expect( something ).toHaveBeenCalled();
	});

	it( 'It loads api.Robots selector cache stored in api.Robots.settings.', function() {
		expect( BOLDGRID.SEO.Robots.settings ).toBeDefined();
		settingsInitialized = BOLDGRID.SEO.Robots.settings;
		expect( settingsInitialized.noIndex.selector ).toBe( 'input[name=butterbean_boldgrid_seo_setting_bgseo_robots_index][value="noindex"]' );
	});

});

describe( 'api.Robots.indexScore() : Gets status/message for index/noindex.', function() {

	sandbox( '<div id="butterbean-boldgrid_seo-section-bgseo_visibility" class="butterbean-section butterbean-section-default" aria-hidden="false"><div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div><div id="butterbean-control-bgseo_robots_follow" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Follow<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Having this set to follow means that search engines are able to count and follow where your links go to.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="follow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow" checked="checked">follow</label></li><li><label><input type="radio" value="nofollow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow">nofollow</label></li></ul></div><div id="butterbean-control-bgseo_canonical" class="butterbean-control butterbean-control-text"><label><span class="butterbean-label">Canonical Link<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">The canonical URL that this page should point to, leave it empty to default to the permalink.</span><input type="text" value="" name="butterbean_boldgrid_seo_setting_bgseo_canonical" class="widefat" placeholder="http://local.wordpress.dev/about-us-staging/"></label></div></div>' );

	it( 'Returns a msg object when index/noindex score is requested.', function() {
		// set onReady
		BOLDGRID.SEO.Robots.onReady();
		var msg = BOLDGRID.SEO.Robots.indexScore();
		expect( _.isObject( msg ) ).toBeTruthy();
	});

	it( 'Score for index/noindex has a msg property.', function() {
		// set onReady
		BOLDGRID.SEO.Robots.onReady();
		var msg = BOLDGRID.SEO.Robots.indexScore();
		expect( msg.msg ).toBeDefined();
	});

	it( 'Score for index/noindex has a status property.', function() {
		// set onReady
		BOLDGRID.SEO.Robots.onReady();
		var msg = BOLDGRID.SEO.Robots.indexScore();
		expect( msg.status ).toBeDefined();
	});

	it( 'Sets status to \'green\' if index is selected', function() {
		BOLDGRID.SEO.Robots.settings.indexInput.filter( '[value="index"]').click();
		expect( BOLDGRID.SEO.Robots.indexScore().status ).toBe( 'green' );
	});

	it( 'Sets status to \'red\' if noindex is selected', function() {
		BOLDGRID.SEO.Robots.settings.indexInput.filter( '[value="noindex"]').click();
		expect( BOLDGRID.SEO.Robots.indexScore().status ).toBe( 'red' );
	});

});

describe( 'api.Robots.followScore() : Gets status/message for follow/nofollow.', function() {

	sandbox( '<div id="butterbean-boldgrid_seo-section-bgseo_visibility" class="butterbean-section butterbean-section-default" aria-hidden="false"><div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div><div id="butterbean-control-bgseo_robots_follow" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Follow<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Having this set to follow means that search engines are able to count and follow where your links go to.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="follow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow" checked="checked">follow</label></li><li><label><input type="radio" value="nofollow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow">nofollow</label></li></ul></div><div id="butterbean-control-bgseo_canonical" class="butterbean-control butterbean-control-text"><label><span class="butterbean-label">Canonical Link<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">The canonical URL that this page should point to, leave it empty to default to the permalink.</span><input type="text" value="" name="butterbean_boldgrid_seo_setting_bgseo_canonical" class="widefat" placeholder="http://local.wordpress.dev/about-us-staging/"></label></div></div>' );

	it( 'Returns a msg object when score is requested.', function() {
		// set onReady
		BOLDGRID.SEO.Robots.onReady();
		var msg = BOLDGRID.SEO.Robots.followScore();
		expect( _.isObject( msg ) ).toBeTruthy();
	});

	it( 'Score for follow/nofollow has a msg property.', function() {
		// set onReady
		BOLDGRID.SEO.Robots.onReady();
		var msg = BOLDGRID.SEO.Robots.followScore();
		expect( msg.msg ).toBeDefined();
	});

	it( 'Score for follow/nofollow has a status property.', function() {
		// set onReady
		BOLDGRID.SEO.Robots.onReady();
		var msg = BOLDGRID.SEO.Robots.followScore();
		expect( msg.status ).toBeDefined();
	});

	it( 'Sets status to \'green\' if index is selected', function() {
		BOLDGRID.SEO.Robots.settings.followInput.filter( '[value="follow"]').click();
		expect( BOLDGRID.SEO.Robots.followScore().status ).not.toBe( 'yellow' );
		expect( BOLDGRID.SEO.Robots.followScore().status ).toBe( 'green' );
	});

	it( 'Sets status to \'red\' if noindex is selected', function() {
		BOLDGRID.SEO.Robots.settings.followInput.filter( '[value="nofollow"]').click();
		expect( BOLDGRID.SEO.Robots.followScore().status ).not.toBe( 'green' );
		expect( BOLDGRID.SEO.Robots.followScore().status ).toBe( 'yellow' );
	});

});

describe( 'api.Robots._follow() : Sets up event listener and triggers bgseo-analysis.', function() {

	sandbox( '<div id="butterbean-boldgrid_seo-section-bgseo_visibility" class="butterbean-section butterbean-section-default" aria-hidden="false"><div id="butterbean-control-bgseo_robots_index" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Index<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Setting this to index means that search engines are encouraged to show your website in their search results.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="index" name="butterbean_boldgrid_seo_setting_bgseo_robots_index" checked="checked">index</label></li><li><label><input type="radio" value="noindex" name="butterbean_boldgrid_seo_setting_bgseo_robots_index">noindex</label></li></ul></div><div id="butterbean-control-bgseo_robots_follow" class="butterbean-control butterbean-control-radio"><span class="butterbean-label">Meta Robots Follow<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">Having this set to follow means that search engines are able to count and follow where your links go to.</span><ul class="butterbean-radio-list"><li><label><input type="radio" value="follow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow" checked="checked">follow</label></li><li><label><input type="radio" value="nofollow" name="butterbean_boldgrid_seo_setting_bgseo_robots_follow">nofollow</label></li></ul></div><div id="butterbean-control-bgseo_canonical" class="butterbean-control butterbean-control-text"><label><span class="butterbean-label">Canonical Link<span class="bgseo-tooltip dashicons dashicons-editor-help" aria-expanded="false"></span></span><span class="butterbean-description" style="display: none;">The canonical URL that this page should point to, leave it empty to default to the permalink.</span><input type="text" value="" name="butterbean_boldgrid_seo_setting_bgseo_canonical" class="widefat" placeholder="http://local.wordpress.dev/about-us-staging/"></label></div></div>' );

	it( '_follow is triggered on document ready.', function() {
		var _follow = spyOn( BOLDGRID.SEO.Robots, '_follow' );
		// Set document ready.
		BOLDGRID.SEO.Robots.onReady();
		expect( _follow ).toHaveBeenCalled();
	});

	it( 'Event listener triggers the seo analysis.', function() {
		var triggered = false;
		$( document ).on( 'bgseo-analysis', function( e, eventInfo ) {
			triggered = true;
		});
		// set onReady to trigger _follow.
		BOLDGRID.SEO.Robots.onReady();
		// triggered should be set to false.
		expect( triggered ).toBeFalsy();
		// force change event on follow input to trigger analysis.
		BOLDGRID.SEO.Robots.settings.followInput.change();
		// triggered should be set to true now.
		expect( triggered ).toBeTruthy();
	});

});
