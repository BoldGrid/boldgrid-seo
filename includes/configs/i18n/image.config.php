<?php
return array(
	'length' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'Your article %1$scontains at least one image%2$s, which is great for SEO, awesome!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#images" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'bad' => sprintf( __( 'Try adding %1$sat least one image%2$s that\'s relevant to your content\'s topic to further optimize your page.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#images" target="_blank">',
			'</a>'
		),
	),
);
