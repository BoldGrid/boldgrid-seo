<?php
return array(
	'length' => array(
		'badEmpty'  => __( 'Your custom SEO Description is empty!  Try adding a description with your focus keyword.', 'bgseo' ),
		'badLong'  => __( 'Your custom SEO Description is over the 156 character recommended length, you should consider making it shorter.', 'bgseo' ),
		'ok'   => __( 'You should make your SEO description longer!  We recommend 125-156 characters for the best results.', 'bgseo' ),
		// Max value.
		'okScore' => 125,
		'good' => __( 'Your SEO Description looks great, and is optimized for search engines!', 'bgseo' ),
		// Max value.
		'goodScore' => 156,
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
);
