<?php
return array(
	'length' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'badEmpty'  => sprintf( __( 'You haven\'t entered a custom %1$sSEO Title%2$s to your page, you should consider adding one.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#title" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'badLong'  => sprintf( __( 'Your custom %1$sSEO Title%2$s is longer than the recommended 70 characters, you should consider making it shorter.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#title" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'ok'   => sprintf( __( 'We suggest making your %1$sSEO Title%2$s at least 30 characters.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#title" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'Your %1$sSEO Title%2$s is a good length, and optimized for search engines!', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#title" target="_blank">',
			'</a>'
		),
		// Max value.
		'okScore' => 30,
		// Max value.
		'goodScore' => 70,
	),
	'keywordUsage' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'bad'  => sprintf( __( 'You should try to use your focus keyword phrase at least one time in your %1$sSEO Title%2$s.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/keywords#title" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'ok'   => sprintf( __( 'It’s great you’ve used the focus keyword phrase in your %1$sSEO Title%2$s, but you should try to only use that one time.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/keywords#title" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'Your %1$sSEO Title%2$s is optimized by using your focus keyword phrase!', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/keywords#title" target="_blank">',
			'</a>'
		),
	),
	'stopWords' => array(
		'ok' => __( 'Your title makes use of a stop word.  We don\'t recommend using these as they can negatively imapct your SEO efforts', 'bgseo' ),
		'good' => __( 'Your title doesn\'t use any stop words that will negatively impact your SEO ranking! Good Job!', 'bgseo' ),
	),
);
