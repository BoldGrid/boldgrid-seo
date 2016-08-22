<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Update
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

/**
 * BoldGrid SEO Update class.
 */
class Boldgrid_Seo_Update {

	protected $configs;
	/**
	 * Constructor.
	 *
	 * Add hooks.
	 *
	 * @global $pagenow The current WordPress page filename.
	 * @global $wp_version The WordPress version.
	 *
	 * @return null
	 *
	 */
	public function __construct( $configs ) {
		$this->configs = $configs;
		// Only for wp-admin.
		if ( is_admin() ) {
			// Get the current WordPress page filename.
			global $pagenow;

			// Make an array of plugin update pages.
			$plugin_update_pages = array(
				'plugins.php',
				'update-core.php'
			);

			// Is page for plugin information?
			$is_plugin_information = ( 'plugin-install.php' === $pagenow && isset( $_GET['plugin'] ) &&
				 'boldgrid-seo' === $_GET['plugin'] && isset( $_GET['tab'] ) &&
				 'plugin-information' === $_GET['tab'] );

			// Is this a plugin update action?
			$is_plugin_update = ( isset( $_REQUEST['action'] ) && 'update-plugin' === $_REQUEST['action'] && 'admin-ajax.php' === $pagenow );

			// Add filters to modify plugin update transient information.
			if ( in_array( $pagenow, $plugin_update_pages, true ) || $is_plugin_information || $is_plugin_update ) {
				// Add filters.
				add_filter( 'pre_set_site_transient_update_plugins', array( $this, 'custom_plugins_transient_update' ), 10, 1 );
				add_filter( 'plugins_api', array( $this, 'custom_plugins_transient_update' ), 10, 1 );
				// Force WP to check for updates, don't rely on cache / transients.
				add_filter( 'site_transient_update_plugins', array( $this, 'site_transient_update_plugins' ), 10 );
			}
		}
	}

	/**
	 * Update the plugin transient.
	 *
	 * @global $pagenow The current WordPress page filename.
	 * @global $wp_version The WordPress version.
	 *
	 * @param object $transient WordPress plugin update transient.
	 * @return object $transient
	 */
	public function custom_plugins_transient_update( $transient ) {
		// Get version data transient.
		$version_data = get_site_transient( 'boldgrid_seo_version_data' );

		// If no configs, then return the current transient.
		if ( ! $this->configs ) {
			return $transient;
		}

		// Get the installed plugin data.
		$plugin_data = get_plugin_data( BOLDGRID_SEO_PATH . '/boldgrid-seo.php', false );

		// Get the WordPress version.
		global $wp_version;

		// Do we have $configs?
		$have_configs = ( false === empty( $this->configs ) );

		// Is force-check present?
		$is_force_check = isset( $_GET['force-check'] );

		// Was the version data recently updated?
		$is_data_old = ( empty( $version_data->updated ) || $version_data->updated < time() - 60 );

		// If we have no transient or force-check is called, and we do have configs, then get data and set transient.
		if ( $have_configs && ( false === $version_data || ( $is_force_check && $is_data_old ) ) ) {
			// Determine the plugin update release channel.
			$options = get_option( 'boldgrid_settings' );

			// Set the release channel.
			$channel = isset( $options['release_channel'] ) ? $options['release_channel'] : 'stable';

			// Get the latest version information.
			// Build the http query.
			$params_array['key'] = 'seo';
			$params_array['channel'] = $channel;
			$params_array['installed_seo_version'] = $plugin_data['Version'];
			$params_array['installed_wp_version'] = $wp_version;
			$params_array['site_hash'] = get_option( 'boldgrid_site_hash' );

			$params = http_build_query( $params_array );

			$query = $this->configs['asset_server'] . $this->configs['ajax_calls']['get_plugin_version'] . '?' . $params;

			// Make the call.
			$version_data = json_decode( wp_remote_retrieve_body( wp_remote_get( $query ) ) );

			// Set the version data transient, expire in 8 hours.
			if ( false === empty( $version_data ) && 200 === $version_data->status &&
				 false === empty( $version_data->result->data ) ) {
				// Add the current timestamp (in seconds).
				$version_data->updated = time();

				// Save the update data in a transient.
				delete_site_transient( 'boldgrid_seo_version_data' );
				set_site_transient( 'boldgrid_seo_version_data', $version_data, 8 * HOUR_IN_SECONDS );

			} else {
				// Something went wrong, so just skip adding update data; return unchanged transient data.
				return $transient;
			}
		}

		// Get the current WordPress page filename.
		global $pagenow;

		// Create a new object to be injected into transient.
		if ( 'plugin-install.php' === $pagenow && isset( $_GET['plugin'] ) &&
			 'boldgrid-seo' === $_GET['plugin'] ) {
			// For version information iframe (/plugin-install.php).
			$transient = new stdClass();

			// If we have section data, then prepare it for use.
			if ( false === empty( $version_data->result->data->sections ) ) {
				// Remove new lines and double-spaces, to help prevent a broken JSON set.
				$version_data->result->data->sections = preg_replace( '/\s+/', ' ',
					trim( $version_data->result->data->sections ) );

				// Convert the JSON set into an array.
				$transient->sections = json_decode( $version_data->result->data->sections, true );

				// If we have data, format it for use, else set a default message.
				if ( false === empty( $transient->sections ) && count( $transient->sections ) > 0 ) {
					foreach ( $transient->sections as $section => $section_data ) {
						$transient->sections[$section] = html_entity_decode( $section_data, ENT_QUOTES );
					}
				} else {
					$transient->sections['description'] = 'Data not available';
				}
			} else {
				$transient->sections['description'] = 'Data not available';
			}

			// Set the other elements.
			$transient->name = $version_data->result->data->title;
			$transient->requires = $version_data->result->data->requires_wp_version;
			$transient->tested = $version_data->result->data->tested_wp_version;
			// $transient->downloaded = $version_data->result->data->downloads;
			$transient->last_updated = $version_data->result->data->release_date;
			$transient->download_link = $this->configs['asset_server'] .
				 $this->configs['ajax_calls']['get_asset'] . '?id=' . $version_data->result->data->asset_id .
				 '&installed_seo_version=' . $plugin_data['Version'] . '&installed_wp_version=' .
				 $wp_version;

			if ( false === empty( $version_data->result->data->compatibility ) && null !== ( $compatibility = json_decode(
				$version_data->result->data->compatibility, true ) ) ) {
				$transient->compatibility = $version_data->result->data->compatibility;
			}

			/*
			 * Not currently showing ratings.
			 * if ( ! ( empty( $version_data->result->data->rating ) ||
			 * empty( $version_data->result->data->num_ratings ) ) ) {
			 * $transient->rating = ( float ) $version_data->result->data->rating;
			 * $transient->num_ratings = ( int ) $version_data->result->data->num_ratings;
			 * }
			 */

			$transient->added = '2015-08-19';

			if ( false === empty( $version_data->result->data->siteurl ) ) {
				$transient->homepage = $version_data->result->data->siteurl;
			}

			if ( false === empty( $version_data->result->data->tags ) && null !== ( $tags = json_decode(
				$version_data->result->data->tags, true ) ) ) {
				$transient->tags = $version_data->result->data->tags;
			}

			if ( false === empty( $version_data->result->data->banners ) && null !== ( $banners = json_decode(
				$version_data->result->data->banners, true ) ) ) {
				$transient->banners = $banners;
			}

			$transient->plugin_name = 'boldgrid-seo.php';
			$transient->slug = 'boldgrid-seo';
			$transient->version = $version_data->result->data->version;
			$transient->new_version = $version_data->result->data->version;
			// $transient->active_installs = true;
		} else {
			// For plugins.php and update-core.php pages.
			$obj = new stdClass();
			$obj->slug = 'boldgrid-seo';
			$obj->plugin = 'boldgrid-seo/boldgrid-seo.php';
			$obj->new_version = $version_data->result->data->version;

			if ( false === empty( $version_data->result->data->siteurl ) ) {
				$obj->url = $version_data->result->data->siteurl;
			}

			$obj->package = $this->configs['asset_server'] . $this->configs['ajax_calls']['get_asset'] . '?id=' .
				 $version_data->result->data->asset_id . '&installed_seo_version=' .
				 $plugin_data['Version'] . '&installed_wp_version=' . $wp_version;

			if ( $plugin_data['Version'] !== $version_data->result->data->version ) {
				$transient->response[$obj->plugin] = $obj;
				$transient->tested = $version_data->result->data->tested_wp_version;
			} else {
				$transient->no_update[$obj->plugin] = $obj;
			}
		}

		return $transient;
	}

	/**
	 * Force WP to check for updates, don't rely on cache / transients.
	 *
	 * @global $pagenow The current WordPress page filename.
	 *
	 * @param object $value WordPress plugin update transient.
	 * @return object
	 */
	public function site_transient_update_plugins( $value ) {
		// Get the current WordPress page filename.
		global $pagenow;

		// Only require fresh data if user clicked "Check Again".
		if ( 'update-core.php' !== $pagenow || false === isset( $_GET['force-check'] ) ) {
			return $value;
		}

		// Set the last_checked to 1, so it will trigger the timeout and check again.
		if ( isset( $value->last_checked ) ) {
			$value->last_checked = 1;
		}

		return $value;
	}

	/**
	 * Action to add a filter to check if this plugin should be auto-updated.
	 *
	 * @since 1.1.1
	 */
	public function wp_update_this_plugin () {
		// Add filters to modify plugin update transient information.
		add_filter( 'pre_set_site_transient_update_plugins', array( $this, 'custom_plugins_transient_update' ) );
		add_filter( 'plugins_api', array( $this, 'custom_plugins_transient_update' ) );
		add_filter( 'site_transient_update_plugins', array( $this, 'site_transient_update_plugins' ) );
		add_filter( 'auto_update_plugin', array( $this, 'auto_update_this_plugin' ), 10, 2 );
		add_filter( 'auto_update_plugins', array( $this, 'auto_update_this_plugin' ), 10, 2 );
		// Have WordPress check for plugin updates.
		wp_maybe_auto_update();
	}

	/**
	 * Filter to check if this plugin should be auto-updated.
	 *
	 * @since 1.1.1
	 *
	 * @param bool $update Whether or not this plugin is set to update.
	 * @param object $item The plugin transient object.
	 * @return bool Whether or not to update this plugin.
	 */
	public function auto_update_this_plugin ( $update, $item ) {
		if ( isset( $item->slug['boldgrid-seo'] ) && isset( $item->autoupdate ) ) {
			return true;
		} else {
			return $update;
		}
	}
}
