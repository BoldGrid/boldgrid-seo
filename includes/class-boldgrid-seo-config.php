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
		self::assign_configs();
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
		$this->configs = include $path .'/base.config.php';
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

	/**
	 * Set the default title per each page & post.
	 *
	 * @since   1.0.0
	 * @return  string  Page Title - Blog Name
	 */
	public function meta_title() {
		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] && isset( $_GET['post'] ) ) {
			return apply_filters( 'the_title', get_the_title( $_GET['post'] ) ) . ' - ' . get_bloginfo( 'name' );
		}
	}

	/**
	 * Set the default meta description for each page & post.
	 *
	 * @since   1.2.1
	 * @return  string $description A meta description that will be used by default.
	 */
	public function meta_description() {
		$description = '';
		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] && isset( $_GET['post'] )
			&& $meta = get_post_meta( $_GET['post'], 'meta_description', true ) ) {
				$description = $meta;
		}
		elseif ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] && isset( $_GET['post'] )
			&& $meta = get_post_field( 'post_content', $_GET['post'] ) ) {
				$description = wp_trim_words( $meta, '30', '' );
				$description = explode( '.', $description );

				$count = count( $description );

				if ( $count > 1 ) {
					array_pop( $description );
				}

				$meta_desc = '';

				foreach( $description as $v ) {
					$meta_desc .= "{$v}. ";
				}

				$meta_desc = trim( $meta_desc );
		}

		return $meta_desc;
	}
}
