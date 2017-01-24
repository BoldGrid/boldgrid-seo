<?php
return array(
	'recommendedKeyword' => array(
		'template' => '%s: <b>%s</b>.',
		'text'  => __( 'Based on your content and frequency, search engines will likely think your content is about', 'bgseo' ),
		'setNewTarget' => __( 'Set a new target keyword below, and the dashboard will be updated with new stats!', 'bgseo' ),
	),
	// Values are percentages.
	'recommendedCount' => array(
		'min' => 0.5,
		'max' => 2.5,
	),
	'keywordPhrase' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'good' => sprintf( __( 'Great, you\'ve entered a %1$skeyword phrase%2$s for the focus of your content!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#keyword-phrase-length" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'ok' => sprintf( __( 'It looks like you have entered a single word for the keyword.  We recommend adding a %1$skeyword phrase%2$s instead of a single word for better results.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#keyword-phrase-length" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'bad' => sprintf( __( 'You haven\'t entered a %1$skeyword phrase%2$s for the focus of this content.  This helps guide you in writing better optimized content!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#keyword-phrase-length" target="_blank">',
			'</a>'
		),
	),
);
