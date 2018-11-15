<?php
return array(
	'length' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'badEmpty'  => sprintf( __( 'Your custom %1$sSEO Description%2$s is empty!  Try adding a description with your focus keyword phrase.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#description" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'badLong'  => sprintf( __( 'Your custom %1$sSEO Description%2$s is over the 300 character recommended length, you should consider making it shorter.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#description" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'ok'   => sprintf( __( 'You should make your %1$sSEO Description%2$s longer!  We recommend 125-300 characters for the best results.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#description" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'Your %1$sSEO Description%2$s looks great, and is optimized for search engines!', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/title-and-description#description" target="_blank">',
			'</a>'
		),
		// Max value.
		'okScore' => 125,
		// Max value.
		'goodScore' => 300,
	),
	'keywordUsage' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'bad'  => sprintf( __( 'Try incorporating your focus keyword phrase to your custom %1$sSEO Description%2$s for better optimization!', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/keywords#description" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'ok'   => sprintf( __( 'Your focus keyword phrase is used too frequently in your %1$sSEO Description%2$s.  You should try removing some of the references.', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/keywords#description" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'The %1$sSEO Description%2$s is properly optimized by using your focus keyword phrase!  Good job!', 'bgseo' ),
			'<a href="https://www.boldgrid.com/support/seo/keywords#description" target="_blank">',
			'</a>'
		),
	),
	'stopWords' => array(
		'ok' => __( 'Your title makes use of a stop word.  We don\'t recommend using these as they can negatively imapct your SEO efforts', 'bgseo' ),
		'good' => __( 'Your title doesn\'t use any stop words that will negatively impact your SEO ranking! Good Job!', 'bgseo' ),
	),
);
