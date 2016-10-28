<?php
return array(
	'noSEOTitle' => __( 'You should consider adding a custom SEO Title to your page!' , 'bgseo' ),
	'longerTitle' => __( 'We suggest making your SEO title at least 30 characters.', 'bgseo' ),
	'topKeywords' => __( 'Based on your content the search engines see the word %s the most, so they would think your page is related to that word.', 'bgseo' ),
	'seoTitle' => array(
		'length' => array(
			'badEmpty'  => __( 'You haven\'t entered a custom SEO Title to your page, you should consider adding one.', 'bgseo' ),
			'badLong'  => __( 'Your custom SEO Title is longer than the recommended 70 characters, you should consider making it shorter.', 'bgseo' ),
			'ok'   => __( 'We suggest making your SEO title at least 30 characters.', 'bgseo' ),
			'good' => __( 'Your SEO Title is a good length, and optimized for Search Engines!', 'bgseo' ),
		),
		'keywordUsage' => array(
			'bad'  => __( 'You should try to use your focus keyword at least one time in your SEO title.', 'bgseo' ),
			'ok'   => __( 'It’s great you’ve used the focus keyword in your title, but you should try to only use that one time.', 'bgseo' ),
			'good' => __( 'Your SEO Title is optimized by using your focus keyword!', 'bgseo' ),
		),
		'stopWords' => array(
			'ok' => __( 'Your title makes use of a stop word.  We don\'t recommend using these as they can negatively imapct your SEO efforts', 'bgseo' ),
			'good' => __( 'Your title doesn\'t use any stop words that will negatively impact your SEO ranking! Good Job!', 'bgseo' ),
		),
	),
	'seoDescription' => array(
		'length' => array(
			'badEmpty'  => __( 'Your custom SEO Description is empty!  Try adding a description with your focus keyword in it.', 'bgseo' ),
			'badLong'  => __( 'Your custom SEO Description is over the 156 character recommended length, you should consider making it shorter.', 'bgseo' ),
			'ok'   => __( 'You should make your SEO description longer!  We recommend 125-156 characters for the best results.', 'bgseo' ),
			'good' => __( 'Your SEO Description looks great, and is optimized for search engines!', 'bgseo' ),
		),
		'keywordUsage' => array(
			'bad'  => __( 'Try incorporating your focus keyword to your custom SEO Description for better optimization!', 'bgseo' ),
			'ok'   => __( 'Your focus keyword is used too frequently in your SEO Description.  You should try removing some of the references.', 'bgseo' ),
			'good' => __( 'The custom SEO Description is properly optimized by using your focus keyword in it!  Good job!', 'bgseo' ),
		),
		'stopWords' => array(
			'ok' => __( 'Your title makes use of a stop word.  We don\'t recommend using these as they can negatively imapct your SEO efforts', 'bgseo' ),
			'good' => __( 'Your title doesn\'t use any stop words that will negatively impact your SEO ranking! Good Job!', 'bgseo' ),
		),
	),
);
