<?php
return array(
	'post_types' => array(
		'post',
		'page'
	),
	'nonce'      => array(
		'action'     => 'boldgrid-seo',
		'name'       => 'boldgrid-seo_nonce',
	),
	'manager' => array(
			'label'     => __( 'BoldGrid SEO', 'bgseo' ),
			'post_type' => array( 'post', 'page' ),
			'context'   => 'normal',
			'priority'  => 'high',
	),
	'section' => array(
		'bgseo_dashboard' => array(
			'label' => __( 'SEO Dashboard', 'bgseo' ),
			'icon'  => 'dashicons-chart-area',
		),
		'bgseo_meta' => array(
			'label' => __( 'Title & Description', 'bgseo' ),
			'icon'  => 'dashicons-edit',
		),
		'bgseo_visibility' => array(
			'label' => __( 'Search Visibility', 'bgseo' ),
			'icon'  => 'dashicons-visibility',
		),
		'bgseo_keywords' => array(
			'label' => __( 'Keywords', 'bgseo' ),
			'icon'  => 'dashicons-search',
		),
	),
	'control' => array(
		'bgseo_dash_html' => array(
			'type'        => 'dashboard',
			'section'     => 'bgseo_dashboard',
		),
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
				'maxlength' => '70',
				'class' => 'widefat',
			),
			'label'       => __( 'SEO Title', 'bgseo' ),
			'description' => __( 'This is very important for search engines.  The SEO Title is what usually shows as the link to your page in a Search Engine Results Page.', 'bgseo' ),
		),
		'bgseo_description' => array(
			'type'        => 'textarea',
			'section'     => 'bgseo_meta',
			'attr'        => array(
				'id' => 'boldgrid-seo-field-meta_description',
				'placeholder' => $this->util->meta_description(),
				'maxlength' => '156',
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
			'label'       => __( 'Meta Robots Index', 'bgseo' ),
			'choices'     => array(
				'index' => 'index',
				'noindex' => 'noindex',
			)
		),
		'bgseo_robots_follow' => array(
			'type'        => 'radio',
			'section'     => 'bgseo_visibility',
			'label'       => __( 'Meta Robots Follow', 'bgseo' ),
			'choices'     => array(
				'follow' => 'follow',
				'nofollow' => 'nofollow',
			)
		),
		'bgseo_canonical' => array(
			'type'        => 'text',
			'section'     => 'bgseo_visibility',
			'attr'        => array(
				'class' => 'widefat',
			),
			'label'       => __( 'Canonical Link', 'bgseo' ),
			'description' => __( 'The canonical URL that this page should point to, leave it empty to default to the permalink.', 'bgseo' ),
		),
		'bgseo_keyword_analaysis' => array(
			'type'        => 'dashboard',
			'section'     => 'bgseo_keywords',
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
			'label'       => __( 'Custom SEO Target Keyword', 'bgseo' ),
		),
	),
);
