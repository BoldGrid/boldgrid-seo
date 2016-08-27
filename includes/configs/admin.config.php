<?php
return array(
	'post_types'        => array( '' ),
	'meta_fields'       => array(
		'description'      => '<meta property="og:description" name="description" content="%s">',
		'keywords'         => '<meta name="keywords" content="%s">',
		'classification'   => '<meta property="og:classification" content="%s">',
		'site_name'        => '<meta property="og:site_name" name="copyright" content="%s">',
		'title'            => '<meta property="og:title" content="%s">',
		'image'            => '<meta property="og:image" content="%s">',
		'type'             => '<meta property="og:type" content="%s">',
	),
	'field_groups'      => array (
		array (
			'id'              => 'boldgrid-seo',
			'title'           => __( 'Search Engine Optimization', 'boldgrid-seo' ),
			'fields'          => array (
				array (
					'label'         => __( 'SEO Title', 'boldgrid-seo' ),
					'name'          => 'meta_title',
					'type'          => 'textarea',
					'placeholder'   => $this->util->meta_title(),
					'instructions'  => __( 'This is <b>very important</b> for Google and Bing, see the Help Tab for more information.  Limit is %d characters.', 'boldgrid-seo' ),
					'maxlength'     => 70,
				),
				array (
					'label'         => __( 'Meta Description', 'boldgrid-seo' ),
					'name'          => 'meta_description',
					'type'          => 'textarea',
					'placeholder'   => $this->util->meta_description(),
					'instructions'  => __( 'Typically what will show in a <b>S</b>earch <b>E</b>ngine <b>R</b>esults <b>P</b>age ( SERP ).  This is important, but secondary to your SEO Title.  Limit is %d characters.', 'boldgrid-seo' ),
					'maxlength'     => 156,
				),
				array (
					'label'         => __( 'Meta Keywords', 'boldgrid-seo' ),
					'name'          => 'meta_keywords',
					'type'          => 'text',
					'placeholder'	=> '',
					'instructions'  => __( 'We recommend using only one or two keywords. Too many keywords can actually hurt your SEO.', 'boldgrid-seo' ),
				),
				array (
					'label'         => __( 'Open Graph Image', 'boldgrid-seo' ),
					'name'          => 'meta_image',
					'type'          => 'image',
					'instructions'  => __( 'Used by some social media sites when a user shares this content.', 'boldgrid-seo' ),
				),
				array (
					'label'         => __( 'Open Graph Type', 'boldgrid-seo' ),
					'name'          => 'meta_type',
					'type'          => 'text',
					'instructions'  => __( 'Used by some social media sites when a user shares this content.', 'boldgrid-seo' ),
				),
			),
			'post_types'      => array(),
			'menu_order'      => 0,
			'context'         => 'normal',
			'priority'        => 'low',
			'label_placement' => 'top',
		),
	),
);
