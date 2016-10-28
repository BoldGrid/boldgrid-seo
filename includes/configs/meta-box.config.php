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
			'label'     => 'BoldGrid SEO',
			'post_type' => array( 'post', 'page' ),
			'context'   => 'normal',
			'priority'  => 'high',
	),
	'section' => array(
		'bgseo_dashboard' => array(
			'label' => 'SEO Dashboard',
			'icon'  => 'dashicons-chart-area'
		),
		'bgseo_meta' => array(
			'label' => 'Title & Description',
			'icon'  => 'dashicons-edit'
		),
		'bgseo_visibility' => array(
			'label' => 'Search Visibility',
			'icon'  => 'dashicons-visibility'
		),
		'bgseo_keywords' => array(
			'label' => 'Keywords',
			'icon'  => 'dashicons-search'
		),
	),
	'control' => array(
		'bgseo_dash_html' => array(
			'type'        => 'dashboard',
			'section'     => 'bgseo_dashboard',
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
			'label'       => 'SEO Title',
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
			'label'       => 'SEO Description',
		),
		'bgseo_robots_index' => array(
			'type'        => 'radio',
			'section'     => 'bgseo_visibility',
			'label'       => 'Meta Robots Index',
			'choices'     => array(
				'index' => 'index',
				'noindex' => 'noindex',
			)
		),
		'bgseo_robots_follow' => array(
			'type'        => 'radio',
			'section'     => 'bgseo_visibility',
			'label'       => 'Meta Robots Follow',
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
			'label'       => 'Canonical Link',
			'description' => 'The canonical URL that this page should point to, leave it empty to default to the permalink.',
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
				'maxlength' => '90',
				'class' => 'widefat',
			),
			'label'       => 'Custom SEO Target Keyword',
		),
	),
);
