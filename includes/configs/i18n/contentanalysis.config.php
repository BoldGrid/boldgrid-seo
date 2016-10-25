<?php
return array(
	'noSEOTitle' => __( 'You should consider adding a custom SEO Title to your page!' , 'bgseo' ),
	'longerTitle' => __( 'We suggest making your SEO title at least 30 characters.', 'bgseo' ),
	'topKeywords' => __( 'Based on your content the search engines see the word %s the most, so they would think your page is related to that word.', 'bgseo' ),
	'seoTitle' => array(
		'length' => array(
			'bad'  => __( 'You haven\'t entered a custom SEO Title to your page, you should consider adding one.', 'bgseo' ),
			'ok'   => __( 'We suggest making your SEO title at least 30 characters.', 'bgseo' ),
			'good' => __( 'You SEO Title is a good length, and optimized for Search Engines!', 'bgseo' ),
		) ,
		'keywordUsage' => array(
			'bad'  => __( 'You should try to use your focus keyword at least one time in your SEO title.', 'bgseo' ),
			'ok'   => __( 'We suggest making your SEO title at least 30 characters.', 'bgseo' ),
			'good' => __( 'Your SEO Title is optimized by using your focus keyword!', 'bgseo' ),
		),
		'stopWords' => array(
			'ok' => __( 'Your title makes use of a stop word.  We don\'t recommend using these as they can negatively imapct your SEO efforts', 'bgseo' ),
			'good' => __( 'Your title doesn\'t use any stop words that will negatively impact your SEO ranking! Good Job!', 'bgseo' ),
		),
	),
);
