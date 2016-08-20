<?php

/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrod.com>
 */

// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * BoldGrid Form configuration class
 */
class Boldgrid_Seo_Config {
	/**
	 * Configs.
	 *
	 * @var array
	 */
	protected $configs;

	/**
	 * Get configs.
	 */
	public function get_configs() {
		return $this->configs;
	}

	/**
	 * Set configs.
	 *
	 * @param array $Configs
	 *
	 * @return bool
	 */
	protected function set_configs( $configs ) {
		$this->configs = $configs;
		return true;
	}

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Define Editor configuration directory.
		if ( false === defined( 'BOLDGRID_SEO_CONFIGDIR' ) ) {
			define( 'BOLDGRID_SEO_CONFIGDIR', BOLDGRID_SEO_PATH . '/includes/configs' );
		}
		self::assign_configs();

		$configs = $this->configs;

		$local = BOLDGRID_SEO_PATH . '/includes/configs/config.local.php';

		if ( file_exists( $local ) ) {
			require_once BOLDGRID_SEO_PATH . '/includes/configs/config.local.php';
			$configs = array_merge( $this->configs, $local );
		}

		$this->set_configs( $configs );
	}

	/**
	 * Include customizer configuration options to assign.
	 *
	 * Configuration files for the customizer are loaded from
	 * includes/configs/customizer-options/.
	 *
	 * @since    1.1
	 * @access   private
	 */
	private function assign_configs( $folder = '' ) {
		$path = __DIR__ . '/configs/'. $folder;
		foreach ( glob( $path . '/*.config.php' ) as $filename ) {
			$option = basename( str_replace( '.config.php', '', $filename ) );
			if ( ! empty( $folder ) ) {
				$this->configs[ $folder ][ $option ] = include $filename;
			} else {
				$this->configs[ $option ] = include $filename;
			}
		}
	}

	/**
	 * Set the default title per each page & post.
	 *
	 * @since 	1.0.0
	 * @return 	string 	Page Title - Blog Name
	 */
	public function boldgrid_titles() {
		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] && isset( $_GET['post'] ) ) {
			return apply_filters( 'the_title', get_the_title( $_GET['post'] ) ) . ' - ' . get_bloginfo( 'name' );
		}
	}
}
