<?php
// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/* @formatter:off */
return array (
	'ajax_calls' => array (
		'get_plugin_version' =>							'/api/open/get-plugin-version',
		'get_asset' =>									'/api/open/get-asset',
	),
	'asset_server' =>									'https://wp-assets.boldgrid.com',
);
/* @formatter:on */
