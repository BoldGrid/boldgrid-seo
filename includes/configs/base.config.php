<?php
$plugin = 'boldgrid-seo';
$base_path = wp_normalize_path( plugin_dir_path( dirname( dirname(__FILE__) ) ) );
$base_url  = dirname( plugin_dir_url( __DIR__ ) );
return array(
	'version' => implode( get_file_data( $base_path . $plugin . '.php', array( 'Version' ), 'plugin' ) ),
	'plugin_path' => $base_path,
	'plugin_url' => $base_url,
	'plugin_name' => $plugin,
	'ajax_calls' => array (
		'get_plugin_version' => '/api/open/get-plugin-version',
		'get_asset' => '/api/open/get-asset',
	),
	'asset_server' => 'https://wp-assets.boldgrid.com',
	'plugin_key_code' => 'seo',
	'main_file_path' => BOLDGRID_SEO_PATH . '/boldgrid-seo.php',
	'plugin_transient_name' => 'boldgrid_seo_version_data',
);
