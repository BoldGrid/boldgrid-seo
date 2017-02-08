<?php
return array(
	'h1' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'It looks like this post is using %1$sonly one H1 tag%2$s! Good job!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#h1-usage" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'badMultiple' => sprintf( __ ( 'This post has %1$smore than one H1 tag%2$s which can negatively impact your SEO.  You should try to only have one H1 on your page.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#h1-usage" target="_blank">',
			'</a>'
		),
		'badBoldgridTheme' => sprintf( __ ( 'This post has %1$smore than one H1 tag%2$s.  Unchecking the %3$s"Display page title"%4$s box at the top of this page will remove an H1 from your page.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#h1-usage" target="_blank">',
			'</a>',
			'<a href="https://boldgrid.com/support/seo/keywords#hide-page-title" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'badEmpty' => sprintf( __( 'Your page %1$sdoesn\'t have any H1 tags%2$s on it, you should considering adding one that includes your target keyword!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#h1-usage" target="_blank">',
			'</a>'
		),
	),
	'keywordUsage' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'Your %1$skeyword appears in your H1 and H2 tags%2$s, which is good for your search engine optimization!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#headings" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'bad' => sprintf( __( 'You have not %1$sused your keyword in any H1 or H2 tags%2$s.  You should try to include this at least once.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#headings" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'ok' => sprintf( __( 'The %1$skeyword appears too much in your H1 and H2 tags%2$s.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#headings" target="_blank">',
			'</a>'
		),
	),
);
