<?php
return array(
	/* translators: 1: opening <a> tag 2: closing </a> tag */
	'good' => sprintf( __( 'This article is set to %1$sindex%2$s, so it is being indexed by search engines!', 'bgseo' ),
		'<a href="https://boldgrid.com/support/seo/search-visibility#index" target="_blank">',
		'</a>'
	),
	/* translators: 1: opening <a> tag 2: closing </a> tag */
	'bad' =>  sprintf( __( 'This page is set to %1$snoindex%2$s, so it is being blocked from search engine indexing!', 'bgseo' ),
		'<a href="https://boldgrid.com/support/seo/search-visibility#index" target="_blank">',
		'</a>'
	),
);
