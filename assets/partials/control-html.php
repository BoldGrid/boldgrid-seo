
<# if ( ! _.isUndefined( data.textstatistics ) ) { #>
	<# if ( ! _.isUndefined( data.textstatistics.readingEase ) ) { #>
	<div class="bgseo-keywords">Reading Ease: {{{ data.textstatistics.readingEase }}}</div>
	<# } #>
	<# if ( ! _.isUndefined( data.textstatistics.recommendedKeywords ) ) { #>
	<div class="bgseo-keywords">Based on your content, search engines will most likely think
		this page is about these Keywords: {{{ data.textstatistics.recommendedKeywords[0][0] }}},
		{{{ data.textstatistics.recommendedKeywords[1][0] }}}, {{{ data.textstatistics.recommendedKeywords[2][0] }}}.
	</div>
	<# } #>
<# } #>
<?php
$meta = '';
if ( isset( $_GET['post'] ) && ! empty( $_GET['post'] )  &&
	$meta = get_post_meta( $_GET['post'], 'boldgrid_seo_title', true ) ) {
	echo 'Great it looks like you have a custom SEO Title!';
	echo '<br>';
} else {
	echo 'You should consider adding a custom SEO Title to your page!';
	echo '<br>';
}
if ( strlen( $meta ) < 30 ) {
	echo 'Consider making your title longer, we suggest making it at least 30 characters.';
	echo '<br>';
} else {
	echo 'Your title is looking snazzy!';
	echo '<br>';
}
