<?php
return array(
	'post_types'        => array( '' ),
	'meta_fields'       => array(
		'description'      => '<meta name="description" content="%s" />',
		'robots'           => '<meta name="robots" content="%s,%s" />',
		'keywords'         => '<meta name="keywords" content="%s" />',
		'locale'           => '<meta property="og:locale" content="%s" />',
		'og_description'   => '<meta property="og:description" content="%s" />',
		'classification'   => '<meta property="og:classification" content="%s" />',
		'site_name'        => '<meta property="og:site_name" name="copyright" content="%s" />',
		'title'            => '<meta property="og:title" content="%s" />',
		'image'            => '<meta property="og:image" content="%s" />',
		'og_type'          => '<meta property="og:type" content="%s" />',
		'og_url'           => '<meta property="og:url" content="%s" />',
		'og_site_name'     => '<meta property="og:site_name" content="%s" />',
		'canonical'        => '<link rel="canonical" href="%s" />',
	),
	'i18n' => array(
		'page' => esc_attr__( 'Page', 'bgseo' ),
	),
);
