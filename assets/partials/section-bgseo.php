<# if ( data.description ) { #>
	<span class="butterbean-description description">{{{ data.description }}}</span>
<# } #>
<# if ( data.analysis ) { #>
	<# _.each( data.analysis, function( recommendation ) { #>
		<# if ( ! _.isUndefined( recommendation.lengthScore ) ) { #>
		<div class="bgseo-recommendations">
			<span class="analysis-suggestion {{{ recommendation.lengthScore.status }}}">
				{{{ recommendation.lengthScore.msg }}}
			</span>
		</div>
		<# } #>
	<# } ); #>
<# } #>
