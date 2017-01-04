<# if ( ! _.isUndefined( data.textstatistics ) ) { #>
	<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords ) ) { #>
	<div class="bgseo-keywords">
		<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords[0] ) ) { #>
			<span class="bgseo-keyword-recommendation">
				Based on your content and frequency, search engines will likely think your content is about: <b>{{{ data.textstatistics.recommendedKeywords[0][0] }}}</b>.
			</span>
		<# } #>
	</div>
	<div class="bgseo-keywords set-new-target">
		<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords[0] ) ) { #>
			<span class="bgseo-keyword-recommendation">
				Set a new target keyword below, and the dashboard will be updated with new stats! First time?  Read our guide on <a href="https://boldgrid.com/support/seo/keywords" target="_blank">SEO and Keywords</a>.
			</span>
		<# } #>
	</div>
	<# } #>
<# } #>
