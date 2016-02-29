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
	 * Configs
	 *
	 * @var array
	 */
	protected $configs;
	
	/**
	 * Get $this->configs
	 */
	public function get_configs() {
		return $this->configs;
	}
	
	/**
	 * Set $this->configs
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
	 * Constructor
	 *
	 * @param unknown $settings        	
	 */
	public function __construct( $settings ) {
		$config_dir = $settings['configDir'];
		
		$global_configs = require $config_dir . '/config.plugin.php';
		
		$local_configs = array ();
		
		if ( file_exists( $local_config_filename = $config_dir . '/config.local.php' ) ) {
			$local_configs = include $local_config_filename;
		}
		
		$configs = array_merge( $global_configs, $local_configs );
		
		$this->set_configs( $configs );
	}
}
