<?php
return array(
	'post_types' => array(
		'post',
		'page',
		'product',
	),
	'nonce'      => array(
		'action'     => 'boldgrid-seo',
		'name'       => 'boldgrid-seo_nonce',
	),
	'manager' => array(
			'label'     => __( 'Easy SEO', 'bgseo' ),
			'post_type' => array( 'post', 'page', 'product' ),
			'context'   => 'normal',
			'priority'  => 'high',
	),
	'section' => array(
		'bgseo_keywords' => array(
			'label' => __( 'Keyword Phrase', 'bgseo' ),
			'icon'  => 'dashicons-search',
		),
		'bgseo_meta' => array(
			'label' => __( 'Title & Description', 'bgseo' ),
			'icon'  => 'dashicons-edit',
		),
		'bgseo_visibility' => array(
			'label' => __( 'Search Visibility', 'bgseo' ),
			'icon'  => 'dashicons-visibility',
		),
	),
	'control' => array(
		'bgseo_meta_analaysis' => array(
			'type'        => 'dashboard',
			'section'     => 'bgseo_meta',
		),
		'bgseo_title' => array(
			'type'        => 'text',
			'section'     => 'bgseo_meta',
			'attr'        => array(
				'id' => 'boldgrid-seo-field-meta_title',
				'placeholder' => $this->util->meta_title(),
				'maxlength' => '60',
				'class' => 'widefat',
			),
			'label'       => __( 'SEO Title', 'bgseo' ),
			'description' => __( 'This is very important for search engines.  The SEO Title is what usually shows as the link to your page in a Search Engine Results Page (SERP).', 'bgseo' ),
		),
		'bgseo_description' => array(
			'type'        => 'textarea',
			'section'     => 'bgseo_meta',
			'attr'        => array(
				'id' => 'boldgrid-seo-field-meta_description',
				'placeholder' => $this->util->meta_description(),
				'maxlength' => '160',
				'class' => 'widefat',
			),
			'label'       => __( 'SEO Description', 'bgseo' ),
			'description' => __( 'Typically what will show in a Search Engine Results Page (SERP).  This is important, but secondary to your SEO Title.', 'bgseo' ),
		),
		'bgseo_visibility_analaysis' => array(
			'type'        => 'dashboard',
			'section'     => 'bgseo_visibility',
		),
		'bgseo_robots_index' => array(
			'type'        => 'radio',
			'section'     => 'bgseo_visibility',
			'label'       => __( 'Tell search engines to read and index this page', 'bgseo' ),
			'choices'     => array(
				'index' => __( 'Yes ( index )', 'bgseo' ),
				'noindex' => __( 'No ( noindex )', 'bgseo' ),
			),
			'description' => __( 'Setting this to index means that search engines are encouraged to show your website in their search results.', 'bgseo' ),
		),
		'bgseo_robots_follow' => array(
			'type'        => 'radio',
			'section'     => 'bgseo_visibility',
			'label'       => __( 'Tell search engines to follow links in this page', 'bgseo' ),
			'choices'     => array(
				'follow' => __( 'Yes ( follow )', 'bgseo' ),
				'nofollow' => __( 'No ( nofollow )', 'bgseo' ),
			),
			'description' => __( 'Having this set to follow means that search engines are able to count and follow where your links go to.', 'bgseo' ),
		),
		'bgseo_canonical' => array(
			'type'        => 'text',
			'section'     => 'bgseo_visibility',
			'attr'        => array(
				'class' => 'widefat',
			),
			'label'       => __( 'Tell search engines that another page should be read/indexed in place of this page', 'bgseo' ),
			'description' => __( 'This is called the canonical URL. We recommend that you leave this field empty, so it will use the default permalink.', 'bgseo' ),
		),
		'bgseo_keywords_html' => array(
			'type'        => 'keywords',
			'section'     => 'bgseo_keywords',
		),
		'bgseo_custom_keyword' => array(
			'type'        => 'text',
			'section'     => 'bgseo_keywords',
			'attr'        => array(
				'id' => 'bgseo-custom-keyword',
				'maxlength' => '60',
				'class' => 'widefat',
			),
			'label'       => __( 'Target Keyword or Phrase', 'bgseo' ),
			'description' => __( 'This should be what the main focus of this page or post is about.', 'bgseo' ),
		),
		'bgseo_keyword_analaysis' => array(
			'type'        => 'dashboard',
			'section'     => 'bgseo_keywords',
		),
	),
);
