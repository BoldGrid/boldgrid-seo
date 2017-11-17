<?php
$plugin = 'boldgrid-easy-seo';
$base_path = wp_normalize_path( plugin_dir_path( dirname( dirname(__FILE__) ) ) );
$base_url  = dirname( plugin_dir_url( __DIR__ ) );
return array(
	'version' => implode( get_file_data( $base_path . $plugin . '.php', array( 'Version' ), 'plugin' ) ),
	'plugin_path' => $base_path,
	'plugin_url' => $base_url,
	'plugin_name' => $plugin,
);
