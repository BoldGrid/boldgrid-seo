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
 * Plugin Name: BoldGrid Easy SEO
 * Plugin URI: https://www.boldgrid.com/boldgrid-seo/
 * Description: Easily manage your website's search engine optimization with Easy SEO by BoldGrid!
 * Version: 1.6.12
 * Author: BoldGrid <support@boldgrid.com>
 * Author URI: https://www.boldgrid.com/
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: bgseo
 * Domain Path: /languages
 *
 * BoldGrid SEO is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * BoldGrid SEO is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BoldGrid SEO. If not, see https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html.
 *
 * This plugin is also inspired by and/or uses code from the following plugins/libraries:
 *
 * ButterBean[https://github.com/justintadlock/butterbean], licensed under GNU General Public License v2.0.
 * TextStatistics.js[https://github.com/cgiffard/TextStatistics.js], licensed under MIT License.
 * WordPress Plugin Boilerplate[https://github.com/DevinVinson/WordPress-Plugin-Boilerplate], licensed under GNU General Public License v2.0.
 * Sewn In Simple SEO[https://github.com/jupitercow/sewn-in-simple-seo], licensed under GNU General Public License v3.0.
 * All In One SEO Pack[https://github.com/semperfiwebdesign/all-in-one-seo-pack], licensed under GNU General Public License v2.0.
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

// Include the autoloader.
require_once wp_normalize_path( plugin_dir_path( __FILE__ ) . '/autoload.php' );

// Define version.
defined( 'BOLDGRID_SEO_VERSION' ) || define( 'BOLDGRID_SEO_VERSION', implode( get_file_data( __FILE__, array( 'Version' ), 'plugin' ) ) );

// Define boldgrid-seo path.
defined( 'BOLDGRID_SEO_PATH' ) || define( 'BOLDGRID_SEO_PATH', dirname( __FILE__ ) );

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
$easy_seo_php_version = version_compare( phpversion(), '5.3.0', '>=' );
$easy_seo_wp_version  = version_compare( get_bloginfo( 'version' ), '4.0', '>=' );

if ( ! $easy_seo_php_version || ! $easy_seo_wp_version ) :
	/**
	 * Display error and deactivate.
	 */
	function easy_seo_php_error() {
		printf( '<div class="error"><p>%s</p></div>',
			esc_html__( 'Easy SEO Error: Easy SEO Supports WordPress version 4.0+, and PHP version 5.3+', 'bgseo' )
		);
		deactivate_plugins( plugin_basename( __FILE__ ) );
	}

	if ( defined( 'WP_CLI' ) ) :
		deactivate_plugins( plugin_basename( __FILE__ ) );
		WP_CLI::warning( __( 'Easy SEO Error: You must have PHP 5.3 or higher and WordPress 4.0 or higher to use this plugin.', 'bgseo' ) );
	else :
		add_action( 'admin_notices', 'easy_seo_php_error' );
	endif;
else : // Load the rest of the plugin that contains code suited for passing the version check.
	/**
	 * Activate.
	 */
	function activate_easy_seo() {
		require_once wp_normalize_path( plugin_dir_path( __FILE__ ) . 'includes/class-boldgrid-seo-activator.php' );
		Boldgrid_Seo_Activator::activate();
	}

	/**
	 * The code that runs during plugin deactivation.
	 * This action is documented in includes/class-boldgrid-seo-deactivator.php
	 */
	function deactivate_easy_seo() {
		require_once wp_normalize_path( plugin_dir_path( __FILE__ ) . 'includes/class-boldgrid-seo-deactivator.php' );
		Boldgrid_Seo_Deactivator::deactivate();
	}

	register_activation_hook( __FILE__, 'activate_easy_seo' );
	register_deactivation_hook( __FILE__, 'deactivate_easy_seo' );

	/**
	 * Begins execution of the plugin.
	 *
	 * Since everything within the plugin is registered via hooks,
	 * then kicking off the plugin from this point in the file does
	 * not affect the page life cycle.
	 *
	 * @since 1.0.0
	 */
	function run_easy_seo() {
		$plugin = new Boldgrid_Seo();
		$plugin->run();
	}
	run_easy_seo();
endif;
