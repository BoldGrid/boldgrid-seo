<# if ( ! _.isUndefined( data.textstatistics ) ) { #>
	<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords ) ) { #>
	<div class="bgseo-keywords">
		<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords[0] ) ) { #>
			<span class="bgseo-keyword-recommendation">
				Based on your content, search engines will likely think your content is about: <b>{{{ data.textstatistics.recommendedKeywords[0][0] }}}</b>.
			</span>
		<# } #>
	</div>
	<# } #>
<# } #>
