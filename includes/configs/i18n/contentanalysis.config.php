<?php
return array(
	'noSEOTitle' => __( 'You should consider adding a custom SEO Title to your page!' , 'bgseo' ),
	'longerTitle' => __( 'We suggest making your SEO title at least 30 characters.', 'bgseo' ),
	'topKeywords' => __( 'Based on your content and frequent use, search engines will likely think this article is about: %s.', 'bgseo' ),
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
	'content' => array(
		'length' => array(
			'badEmpty'  => __( 'You haven\'t entered any content yet!  As you start writing your content, we\'ll make recommendations for better SEO!', 'bgseo' ),
			'badShort'  => __( 'The content should be longer, try writing more relevant information about the focus keyword of this page.', 'bgseo' ),
			'ok'   => __( 'We recommend a minimum of 300 words for the best SEO results.', 'bgseo' ),
			'good' => __( 'Your content is over the recommended minimum of 300 words, good job!', 'bgseo' ),
		),
	),
	'image' => array(
		'length' => array(
			'good' => __( 'Your article contains at least one image, which is great for SEO, awesome!', 'bgseo' ),
			'bad' => __( 'Try adding at least one image that\'s relevant to your content\'s topic to further optimize your page.', 'bgseo' ),
		),
	),
	'readingEase' => array(
		'goodHigh' => 'Your content\'s readability is looking great! It\'s very easy to understand by the majority of readers!',
		'goodMedHigh' => 'The readability of your content is easy to understand by most readers! Awesome!',
		'goodMedLow' => 'Your content is pretty easy to understand by most readers.',
		'goodLow' => 'The readability of this content is okay, but could use some improvements to reach a wider audience.',
		'ok' => 'Your content is pretty hard to read, so you should try to simplify it.',
		'badHigh' => 'The content is hard to read. Try shortening some sentences and using less complex wording to improve this score.',
		'badLow' => 'The text here is very hard to read, and is best understood by university graduates.  You should consider making your sentences shorter and using easier words for people to understand.',
	),
	'noIndex' => array(
		'good' => 'This article is being indexed by search engines!',
		'bad' =>  'Your page is being blocked from search engine indexing!',
	),
	'noFollow' => array(
		'good' => 'Great, your links are set to follow for search engines!',
		'bad' => 'Your links are set to nofollow for search engines!',
	),
);
