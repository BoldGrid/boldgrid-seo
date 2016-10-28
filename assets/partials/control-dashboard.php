<# _.each( data, function( recommendation ) { #>
	<# if ( ! _.isUndefined( recommendation.lengthScore ) ) { #>
	<div class="bgseo-recommendations">
		<span class="analysis-suggestion {{{ recommendation.lengthScore.status }}}">
			{{{ recommendation.lengthScore.msg }}}
		</span>
	</div>
	<# } #>
<# } ); #>
<# if ( ! _.isUndefined( data.textstatistics ) ) { #>
	<# if ( ! _.isUndefined( data.textstatistics.gradeLevel ) ) { #>
		<div class="bgseo-recommendations">
			<span class="analysis-suggestion {{{ data.textstatistics.gradeLevel.status }}}">
				Score: {{{ data.textstatistics.readingEase }}}%. {{{ data.textstatistics.gradeLevel.msg }}}
			</span>
		</div>
	<# } #>
<# } #>
