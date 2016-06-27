<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link http://www.boldgrid.com
 * @since 1.0.0
 * @package Boldgrid_Seo
 *
 *          @wordpress-plugin
 *          Plugin Name: BoldGrid SEO
 *          Plugin URI: http://www.boldgrid.com
 *          Description: Manage your BoldGrid website's SEO.
 *          Version: 1.1.0.1
 *          Author: BoldGrid.com <wpb@boldgrid.com>
 *          Author URI: http://www.boldgrid.com
 *          License: GPL-2.0+
 *          License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *          Text Domain: boldgrid-seo
 *          Domain Path: /languages
 */

// If this file is called directly, abort.
defined( 'WPINC' ) ?  : die();

// Define version.
if ( false === defined( 'BOLDGRID_SEO_VERSION' ) ) {
	define( 'BOLDGRID_SEO_VERSION', '1.1.0.1' );
}

// Define boldgrid-seo path.
if ( false === defined( 'BOLDGRID_SEO_PATH' ) ) {
	define( 'BOLDGRID_SEO_PATH', dirname( __FILE__ ) );
}

// Define Editor configuration directory.
if ( false === defined( 'BOLDGRID_SEO_CONFIGDIR' ) ) {
	define( 'BOLDGRID_SEO_CONFIGDIR', BOLDGRID_SEO_PATH . '/includes/config' );
}

// Load the Boldgrid_Seo class.
require_once BOLDGRID_SEO_PATH . '/includes/class-boldgrid-seo.php';

// If DOING_CRON, then check if this plugin should be auto-updated.
if ( true === defined( 'DOING_CRON' ) && DOING_CRON ){
	// Ensure required definitions for pluggable.
	if ( false === defined( 'AUTH_COOKIE' ) ) {
		define( 'AUTH_COOKIE', null );
	}

	if ( false === defined( 'LOGGED_IN_COOKIE' ) ) {
		define( 'LOGGED_IN_COOKIE', null );
	}

	// Load the pluggable class, if needed.
	require_once ABSPATH . 'wp-includes/pluggable.php';

	// Include the update class.
	require_once BOLDGRID_SEO_PATH . '/includes/class-boldgrid-seo-update.php';

	// Instantiate the update class.
	$plugin_update = new Boldgrid_Seo_Update();

	// Check and update plugins.
	$plugin_update->wp_update_this_plugin();
}

/**
 * Check Versions.
 *
 * This will check to make sure the user has PHP 5.3 or higher, and will also
 * check to make sure they are using WordPress 4.0 or higher.
 *
 * @var $boldgrid_seo_php_version This checks that PHP is 5.3.0 or higher.
 * @var $boldgrid_seo_wp_version This checks that WordPress is 4.0 or higher.
 *
 * @since 1.0.0
 */
$boldgrid_seo_php_version = version_compare( phpversion(), '5.3.0', '>=' );
$boldgrid_seo_wp_version = version_compare( get_bloginfo( 'version' ), '4.0', '>=' );

if ( ! $boldgrid_seo_php_version or ! $boldgrid_seo_wp_version ) :
	function boldgrid_php_error() {
		printf( '<div class="error">' . '<p>%s</p>' . '</div>',

			esc_html__(
				'BoldGrid Error: BoldGrid SEO Supports WordPress version 4.0+, and PHP version 5.3+',
				'boldgrid_seo' ) );

		deactivate_plugins( plugin_basename( __FILE__ ) );
	}

	if ( defined( 'WP_CLI' ) ) :

		deactivate_plugins( plugin_basename( __FILE__ ) );

		WP_CLI::warning(

			__(
				'BoldGrid Error: You must have PHP 5.3 or higher and WordPress 4.0 or higher to use this plugin.',
				'boldgrid_seo' ) );




	else :
		add_action( 'admin_notices', 'boldgrid_php_error' );


	endif;


else : // Load the rest of the plugin that contains code suited for passing the version check.
	function activate_boldgrid_seo() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/class-boldgrid-seo-activator.php';

		Boldgrid_Seo_Activator::activate();
	}

	/**
	 * The code that runs during plugin deactivation.
	 * This action is documented in includes/class-boldgrid-seo-deactivator.php
	 */
	function deactivate_boldgrid_seo() {
		require_once plugin_dir_path( __FILE__ ) . 'includes/class-boldgrid-seo-deactivator.php';

		Boldgrid_Seo_Deactivator::deactivate();
	}

	register_activation_hook( __FILE__, 'activate_boldgrid_seo' );

	register_deactivation_hook( __FILE__, 'deactivate_boldgrid_seo' );

	/**
	 * Begins execution of the plugin.
	 *
	 * Since everything within the plugin is registered via hooks,
	 * then kicking off the plugin from this point in the file does
	 * not affect the page life cycle.
	 *
	 * @since 1.0.0
	 */
	function run_boldgrid_seo() {
		$plugin = new Boldgrid_Seo();
		$plugin->run();
	}

	run_boldgrid_seo();


endif;
