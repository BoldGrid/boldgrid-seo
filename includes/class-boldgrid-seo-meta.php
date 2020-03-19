<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Meta
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrid.com>
 */

/**
 * BoldGrid SEO meta
 */
class Boldgrid_Seo_Meta {

	protected $configs;

	public function __construct( $configs ) {
		$this->configs = $configs;
	}

	/**
	 * Register meta values.
	 *
	 * @since 1.6.5
	 *
	 * @return void
	 */
	public function register() {
		register_meta( 'post', 'bgseo_title', array(
			'type' => 'string',
			'single' => true,
			'show_in_rest' => true,
		) );

		register_meta( 'post', 'bgseo_description', array(
			'type' => 'string',
			'single' => true,
			'show_in_rest' => true,
		) );

		register_meta( 'post', 'bgseo_robots_index', array(
			'type' => 'string',
			'single' => true,
			'show_in_rest' => true,
		) );

		register_meta( 'post', 'bgseo_robots_follow', array(
			'type' => 'string',
			'single' => true,
			'show_in_rest' => true,
		) );
	}
}
