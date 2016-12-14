<?php
return array(
	'length' => array(
		'badEmpty'  => __( 'You haven\'t entered a custom SEO Title to your page, you should consider adding one.', 'bgseo' ),
		'badLong'  => __( 'Your custom SEO Title is longer than the recommended 70 characters, you should consider making it shorter.', 'bgseo' ),
		'ok'   => __( 'We suggest making your SEO Title at least 30 characters.', 'bgseo' ),
		// Max value.
		'okScore' => 30,
		'good' => __( 'Your SEO Title is a good length, and optimized for search engines!', 'bgseo' ),
		// Max value.
		'goodScore' => 70,
	),
	'keywordUsage' => array(
		'bad'  => __( 'You should try to use your focus keyword at least one time in your SEO Title.', 'bgseo' ),
		'ok'   => __( 'It’s great you’ve used the focus keyword in your title, but you should try to only use that one time.', 'bgseo' ),
		'good' => __( 'Your SEO Title is optimized by using your focus keyword!', 'bgseo' ),
	),
	'stopWords' => array(
		'ok' => __( 'Your title makes use of a stop word.  We don\'t recommend using these as they can negatively imapct your SEO efforts', 'bgseo' ),
		'good' => __( 'Your title doesn\'t use any stop words that will negatively impact your SEO ranking! Good Job!', 'bgseo' ),
	),
);
