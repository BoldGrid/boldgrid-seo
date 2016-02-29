<?php

// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Copy this sample file to config.local.php and update it with any variables that you would like to override
 */
/* @formatter:off */
return array (
	'asset_server'   => 'https://wp-assets-dev.boldgrid.com',
);
/* @formatter:on */
