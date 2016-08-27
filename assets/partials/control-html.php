<?php
if ( $meta = get_post_meta( $_GET['post'], 'boldgrid_seo_title', true ) ) {
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
