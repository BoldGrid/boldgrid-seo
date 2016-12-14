<?php
return array(
	'h1' => array(
		'good' => __( 'It looks like this post is using only one H1 tag! Good job!', 'bgseo' ),
		'badMultiple'  => __ ( 'This post has more than one H1 tag which can negatively impact your SEO.  You should try to only have one H1 on your page.', 'bgseo' ),
		'badEmpty' => __( 'Your page doesn\'t have any H1 tags on it, you should considering adding one that includes your target keyword!', 'bgseo' ),
	),
	'keywordUsage' => array(
		'good' => __( 'Your keyword appears in your H1 and H2 tags, which is good for your search engine optimization!', 'bgseo' ),
		'bad' => __( 'You have not used your keyword in any of your H1 or H2 tags.  You should try to include this at least once.', 'bgseo' ),
		'ok' => __( 'The keyword appears too much in your H1 and H2 tags.', 'bgseo' ),
	),
);
