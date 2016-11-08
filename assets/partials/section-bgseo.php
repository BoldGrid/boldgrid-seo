<# if ( data.description ) { #>
	<span class="butterbean-description description">{{{ data.description }}}</span>
<# } #>

<# _.each( data.analysis, function( recommendation ) { #>
	<div class="bgseo-recommendations">
		<span class="analysis-suggestion {{{ recommendation.lengthScore.status }}}">
			{{{ recommendation.lengthScore.msg }}}
		</span>
	</div>
<# } ); #>
