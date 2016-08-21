<?php
$base_path = wp_normalize_path( plugin_dir_path ( __FILE__ ) );
$base_url  = dirname( plugin_dir_url( __DIR__ ) );
return array(
	'version' => '1.2',
	'plugin_path' => $base_path,
	'plugin_url' => $base_url,
	'ajax_calls' => array (
		'get_plugin_version' => '/api/open/get-plugin-version',
		'get_asset' => '/api/open/get-asset',
	),
	'asset_server' => 'https://wp-assets.boldgrid.com',
);
