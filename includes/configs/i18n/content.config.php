<?php
return array(
	'length' => array(
		/** Translators: %s is the total Word Count of the content. **/
		'contentLength' => __( 'Word Count: %s.', 'bgseo' ),
		'badEmpty'  => __( 'You haven\'t entered any content yet!  As you start writing your content, we\'ll make recommendations for better SEO!', 'bgseo' ),
		'badShort'  => __( 'The content should be longer, try writing more about the focus keyword of this page.', 'bgseo' ),
		// Max value.
		'badShortScore' => 199,
		'ok'   => __( 'We recommend a minimum of 300 words for the best SEO results.', 'bgseo' ),
		// Max value.
		'okScore' => 300,
		'good' => __( 'Your content is over the recommended minimum of 300 words, good job!', 'bgseo' ),
	),
	// Since there's no _n() in the js implementation, I'll just add a singular and plural translation for now.
	'keywordUsage' => array(
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'bad'  => sprintf( __( 'You haven\'t used your %1$skeyword in your content%2$s at all.  Try adding it naturally by talking about the subject more.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'okShortSingular' => sprintf( __( 'Your %1$skeyword is being used in your content%2$s, but we recommend using it at least 1 time.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),

		/* translators: 1: opening <a> tag 2: closing </a> tag %%s: is equal to the count that the keyword should appear and added by JS */
		'okShort' => sprintf( __( 'Your %1$skeyword is being used in your content%2$s, but we recommend using it at least %%s times.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),

		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'okLongSingular' => sprintf( __( 'Your %1$skeyword appears excessively in your content%2$s.  Try to only use it 1 time and use other words and variations that are related to it.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag %%s: is equal to the count that the keyword should appear and added by JS */
		'okLong'   => sprintf( __( 'Your %1$skeyword appears excessively in your content%2$s.  Try to only use it %%s times and use other words and variations that are related to it.', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag */
		'goodSingular' => sprintf( __( 'Great, you have included the %1$skeyword in your content%2$s at least 1 time. This helps get you a better SEO score!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),
		/* translators: 1: opening <a> tag 2: closing </a> tag %%s: is equal to the count that the keyword should appear and added by JS */
		'good' => sprintf( __( 'Great, you have included the %1$skeyword in your content%2$s at least %%s times. This helps get you a better SEO score!', 'bgseo' ),
			'<a href="https://boldgrid.com/support/seo/keywords#content" target="_blank">',
			'</a>'
		),
	),
);
