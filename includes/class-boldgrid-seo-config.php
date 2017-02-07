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
class Boldgrid_Seo_Config implements Boldgrid_Seo_Config_Interface {
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
		$this->util = new Boldgrid_Seo_Util();
		self::assign_configs();
		self::assign_configs( 'i18n' );
		$configs = $this->configs;
		$local = BOLDGRID_SEO_PATH . '/includes/configs/config.local.php';
		if ( file_exists( $local ) ) {
			$file = include $local;
			$configs = array_replace_recursive( $configs, $file );
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
	public function assign_configs( $folder = '' ) {
		$path = __DIR__ . '/configs/'. $folder;
		if ( $folder === '' ) $this->configs = include $path . '/base.config.php';
		foreach ( glob( $path . '/*.config.php' ) as $filename ) {
			$option = basename( str_replace( '.config.php', '', $filename ) );
			if ( ! empty( $folder ) ) {
				$this->configs[ $folder ][ $option ] = include $filename;
			} elseif ( 'base' === $option ) {
				continue;
			} else {
				$this->configs[ $option ] = include $filename;
			}
		}
	}
}
