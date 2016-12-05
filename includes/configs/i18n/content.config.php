<?php
return array(
	'length' => array(
		/** Translators: %s is the total Word Count of the content. **/
		'contentLength' => __( 'Word Count: %s.', 'bgseo' ),
		'badEmpty'  => __( 'You haven\'t entered any content yet!  As you start writing your content, we\'ll make recommendations for better SEO!', 'bgseo' ),
		'badShort'  => __( 'The content should be longer, try writing more about the focus keyword of this page.', 'bgseo' ),
		'badShortScore' => 199,
		'ok'   => __( 'We recommend a minimum of 300 words for the best SEO results.', 'bgseo' ),
		'okScore' => 300,
		'good' => __( 'Your content is over the recommended minimum of 300 words, good job!', 'bgseo' ),
	),
	'keywordUsage' => array(
		// Since there's no _n() in the js implementation, I'll just add a singular and plural translation for now.
		/** Translators: %s is equal to the count that the keyword should appear. **/
		'bad'  => __( 'You haven\'t used your keyword in your content at all.  Try adding it naturally by talking about the subject more.', 'bgseo' ),
		'okShortSingular'   => __( 'Your keyword is being used in your content, but we recommend using it at least 1 time.', 'bgseo' ),
		'okShort'   => __( 'Your keyword is being used in your content, but we recommend using it at least %s times.', 'bgseo' ),
		'okLongSingular'   => __( 'Your keyword appears excessively in your content.  Try to only use it 1 time and use other words and variations that are related to it.', 'bgseo' ),
		'okLong'   => __( 'Your keyword appears excessively in your content.  Try to only use it %s times and use other words and variations that are related to it.', 'bgseo' ),
		'goodSingular' => __( 'Great, you have included your keyword at least 1 time in your content. This helps get you a better SEO score!', 'bgseo' ),
		'good' => __( 'Great, you have included your keyword at least %s times in your content. This helps get you a better SEO score!', 'bgseo' ),
	),
);
