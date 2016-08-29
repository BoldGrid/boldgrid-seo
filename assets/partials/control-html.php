<?php
$meta = '';
echo '<tr>
	<td id="wp-word-count" class="hide-if-no-js">Word count: <span class="word-count">235</span></td>
	<td class="autosave-info">
	<span class="autosave-message">&nbsp;</span>
<span id="last-edit">Last edited by admin on August 29, 2016 at 10:31 am</span>	</td>
	<td id="content-resize-handle" class="hide-if-no-js"><br></td>
</tr>';
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
