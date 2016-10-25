
<# if ( ! _.isUndefined( data.textstatistics ) ) { #>
	<# if ( ! _.isUndefined( data.textstatistics.readingEase ) ) { #>
	<div class="bgseo-keywords">Reading Ease: {{{ data.textstatistics.readingEase }}}</div>
	<# } #>
	<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords ) ) { #>
	<div class="bgseo-keywords">
		<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords[0] ) ) { #>
			Based on your content, search engines see this word the most frequent: <b>{{{ data.textstatistics.recommendedKeywords[0][0] }}}</b>.  This is most likely what they think your content is about.
		<# } #>
	</div>
	<# } #>
<# } #>
