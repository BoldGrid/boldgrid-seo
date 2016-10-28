
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

<div class="bgseo-recommendations">
	<# if ( ! _.isUndefined( data.title ) ) { #>
		<span class="analysis-suggestion {{{ data.title.lengthScore.status }}}">
			{{{ data.title.lengthScore.msg }}}
		</span>
	<# } #>
</div>

<div class="bgseo-recommendations">
	<# if ( ! _.isUndefined( data.description ) ) { #>
		<# if ( ! _.isUndefined( data.description.lengthScore ) ) { #>
			<span class="analysis-suggestion {{{ data.description.lengthScore.status }}}">
				{{{ data.description.lengthScore.msg }}}
			</span>
		<# } #>
	<# } #>
</div>
