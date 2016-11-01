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
					BOLDGRID.SEO.TinyMCE.tmceChange( e );
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
		if ( ! in_array( $hook, array ( 'post.php','post-new.php' ) )
			|| ! in_array( $GLOBALS['post_type'], $this->admin->post_types() ) ) {
				return;
		}

		wp_enqueue_style(
			$this->configs['plugin_name'],
			$this->configs['plugin_url'] . '/assets/css/boldgrid-seo-admin.css',
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

		wp_enqueue_script(
			"{$this->configs['plugin_name']}-util",
			"{$this->configs['plugin_url']}/assets/js/boldgrid-seo-util.js",
			array ( 'jquery' ),
			$this->configs['version'],
			false
		);

		wp_enqueue_script(
			$this->configs['plugin_name'] . '-admin',
			$this->configs['plugin_url'] . '/assets/js/boldgrid-seo-admin.js',
			array ( 'jquery' ),
			$this->configs['version'],
			false
		);

		wp_enqueue_script(
			$this->configs['plugin_name'] . '-tinymce',
			$this->configs['plugin_url'] . '/assets/js/boldgrid-seo-tinymce.js',
			array ( 'jquery', 'wp-util', 'word-count' ),
			$this->configs['version'],
			false
		);

		wp_register_script(
			$this->configs['plugin_name'] . '-content-analysis',
			$this->configs['plugin_url'] . '/assets/js/boldgrid-seo-content-analysis.js',
			array ( 'jquery', $this->configs['plugin_name'] . '-util' ),
			$this->configs['version'],
			false
		);

		// Register the script
		wp_register_script(
			$this->configs['plugin_name'] . '-text-statistics',
			$this->configs['plugin_url'] . '/assets/js/text-statistics/index.js',
			array ( 'jquery' ),
			$this->configs['version'],
			false
		);

		wp_enqueue_script(
			'bgseo-control-dashboard-js',
			$this->configs['plugin_url'] . '/assets/js/boldgrid-seo-control-dashboard.js',
			array( 'butterbean', 'backbone', 'wp-util' ),
			$this->configs['version'],
			true
		);

		wp_enqueue_script(
			'bgseo-control-keywords-js',
			$this->configs['plugin_url'] . '/assets/js/boldgrid-seo-control-keywords.js',
			array( 'butterbean', 'backbone', 'wp-util' ),
			$this->configs['version'],
			true
		);

		wp_enqueue_script(
			"{$this->configs['plugin_name']}-robots",
			"{$this->configs['plugin_url']}/assets/js/boldgrid-seo-robots.js",
			array ( 'jquery', $this->configs['plugin_name'] . '-content-analysis' ),
			$this->configs['version'],
			false
		);

		wp_enqueue_script(
			"{$this->configs['plugin_name']}-title",
			"{$this->configs['plugin_url']}/assets/js/boldgrid-seo-title.js",
			array ( 'jquery', $this->configs['plugin_name'] . '-content-analysis' ),
			$this->configs['version'],
			false
		);

		// Localize the script with new data
		wp_localize_script( $this->configs['plugin_name'] . '-text-statistics', '_bgseoStopWords', $this->configs['i18n']['stopwords'] );
		// Enqueued script with localized data.
		wp_enqueue_script( $this->configs['plugin_name'] . '-text-statistics' );

		// Localize the script with new data
		wp_localize_script( $this->configs['plugin_name'] . '-content-analysis', '_bgseoContentAnalysis', $this->configs['i18n']['contentanalysis'] );
		// Enqueued script with localized data.
		wp_enqueue_script( $this->configs['plugin_name'] . '-content-analysis' );
	}
}
