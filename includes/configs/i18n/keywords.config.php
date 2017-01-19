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
		'good' => __( 'Great, you\'ve entered a keyword phrase for the focus of your content!', 'bgseo' ),
		'ok' => __( 'It looks like you have entered a single word for the keyword.  We recommend adding a keyword phrase instead of a single word for better results.', 'bgseo' ),
		'bad' => __( 'You haven\'t entered a keyword or keyword phrase for the focus of this content.  This helps guide you in writing better optimized content!', 'bgseo' ),
	),
);
