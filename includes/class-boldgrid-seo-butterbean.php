<?php
class Boldgrid_Seo_Butterbean {
	public function load() {
		// Only load on pages and posts.
		if ( 'page' !== $post_type && 'post' !== $post_type )
			return;
		}

		require_once( BOLDGRID_SEO_PATH . 'includes/lib/butterbean/butterbean.php' );
	}
}
?>
