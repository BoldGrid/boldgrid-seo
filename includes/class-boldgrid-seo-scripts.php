<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrod.com>
 */

/**
 * BoldGrid SEO Script and Style Enqueue
 */
class Boldgrid_Seo_Scripts {

	protected $configs;

	public function __construct( $configs ) {
		$this->configs = $configs;
		$this->admin = new Boldgrid_Seo_Admin( $this->configs );
	}

	public function tiny_mce( $init ) {
		$init['setup'] = "function( editor ) {
			var timer;
			editor.on( 'keyup propertychange paste', function ( e ) {
				clearTimeout( timer );
				timer = setTimeout( function() {
					if ( typeof BOLDGRID !== 'undefined' && typeof BOLDGRID.SEO !== 'undefined' ) {
						BOLDGRID.SEO.TinyMCE.tmceChange( e );
					}
				}, 2000 );
			} );
		}";
		return $init;
	}
	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles( $hook ) {
		if ( ! in_array( $hook, array ( 'post.php','post-new.php' ) ) || ! in_array( $GLOBALS['post_type'], $this->admin->post_types() ) ) {
			return;
		}

		// Check if script debug is disabled for minified assets.
		$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_enqueue_style(
			$this->configs['plugin_name'],
			"{$this->configs['plugin_url']}/assets/css/boldgrid-seo-admin{$min}.css",
			array(),
			$this->configs['version'],
			'all'
		);
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts( $hook ) {
		if ( ! in_array( $hook, array ( 'post.php','post-new.php' ) ) || ! in_array( $GLOBALS['post_type'], $this->admin->post_types() ) ) {
			return;
		}

		// Check if script debug is disabled for minified assets.
		$min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		wp_register_script(
			"{$this->configs['plugin_name']}-bgseo",
			"{$this->configs['plugin_url']}/assets/js/bgseo{$min}.js",
			array ( 'jquery', 'backbone', 'underscore', 'wp-util', 'word-count', 'butterbean', 'wp-data', 'wp-editor' ),
			$this->configs['version'],
			true
		);

		// Register the script
		wp_register_script(
			"{$this->configs['plugin_name']}-text-statistics",
			"{$this->configs['plugin_url']}/assets/js/text-statistics/index.js",
			array ( 'jquery' ),
			$this->configs['version'],
			false
		);

		wp_enqueue_script( "{$this->configs['plugin_name']}-text-statistics" );

		// Localize the script with new data.
		wp_localize_script( "{$this->configs['plugin_name']}-bgseo", '_bgseoContentAnalysis', $this->configs['i18n'] );

		// Enqueued script with localized data.
		wp_enqueue_script( "{$this->configs['plugin_name']}-bgseo" );
	}
}
