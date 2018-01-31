<?php
/**
 * File: boldgrid-upgrade-to-wporg.php
 *
 * Upgrade this BoldGrid plugin to the WordPress.org version.
 *
 */

/**
 * Anonymous function to perform upgrade.
 *
 * @link https://developer.wordpress.org/reference/functions/plugin_basename/
 * @link https://developer.wordpress.org/reference/classes/plugin_upgrader/install/
 * @link https://developer.wordpress.org/reference/functions/is_wp_error/
 * @link https://developer.wordpress.org/reference/functions/is_plugin_active/
 * @link https://developer.wordpress.org/reference/functions/activate_plugin/
 * @link https://developer.wordpress.org/reference/functions/deactivate_plugins/
 * @link https://developer.wordpress.org/reference/classes/wp_filesystem_direct/rmdir/
 *
 * @global $wp_filesystem The WP_Filesystem global variable.
 */
return function ( $plugin_path, $wporg_package_url ) {
	/**
	 * Get a plugin basename (folder/filename) from a slug (folder name).
	 *
	 * @link https://developer.wordpress.org/reference/functions/get_plugins/
	 *
	 * @param  string $wporg_plugin_slug
	 * @return string|null
	 */
	$get_plugin_basename = function( $wporg_plugin_slug ) {
		$wporg_plugin_basename = null;

		$wporg_plugin = get_plugins( '/' . $wporg_plugin_slug );

		if ( ! empty( $wporg_plugin ) ) {
			$wporg_plugin_keys = array_keys( $wporg_plugin );
			$wporg_plugin_file = reset( $wporg_plugin_keys );
			$wporg_plugin_basename =  $wporg_plugin_slug . '/' . $wporg_plugin_file;
		}

		return $wporg_plugin_basename;
	};

	$wporg_plugin_slug = basename( $wporg_package_url, '.zip' );
	$wporg_plugin_basename = $get_plugin_basename( $wporg_plugin_slug );

	if ( ! $wporg_plugin_basename ) {
		// The wporg plugin was not found; proceed with installation.
		require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';

		/**
		 * Class to override WP_Upgrader_Skin::feedback, to prevent output.
		 */
		class BoldGrid_Temp_Skin extends WP_Upgrader_Skin {
			/**
			 * Null feedback.
			 *
			 * @see WP_Upgrader_Skin::feedback()
			 *
			 * @param  string $string A string; irrelevant; not used.
			 * @return null
			 */
			public function feedback( $string ) {
				return;
			}
		}

		$upgrader = new Plugin_Upgrader( new BoldGrid_Temp_Skin() );
		$upgrader->install( $wporg_package_url );

		if ( is_object( $upgrader->skin->result ) &&
			 ( is_wp_error( $upgrader->skin->result ) || ! $upgrader->skin->result ) ) {
			 	// There was an installation error.
				return;
		}

		$wporg_plugin_basename = $get_plugin_basename( $wporg_plugin_slug );
	}

	// If the wporg plugin is installed, then ensure it is activated.
	if ( $wporg_plugin_basename ) {
		if ( ! is_plugin_active( $wporg_plugin_basename ) ) {
			// The wporg plugin is not activated, so go ahead and try to activate.
			$activate = activate_plugin( $wporg_plugin_basename, '', false, true );

			if ( is_wp_error( $activate ) ) {
				// There was an activation error.
				return;
			}
		}

		if ( is_plugin_active( $wporg_plugin_basename ) ) {
			// The wporg plugin is activated; deactivate and delete the old plugin.
			$plugin_basename = plugin_basename( $plugin_path );
			deactivate_plugins( $plugin_basename, true );

			// Disable displaying of warning after deleting an activated plugin.
			@ini_set( 'display_errors', 'Off' );
			delete_plugins( array( $plugin_basename ) );
		}
	}
};
