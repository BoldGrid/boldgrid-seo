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
		$init['setup'] = "function( editor ) { editor.on('keyup', function ( e ) { BOLDGRID.SEO.TinyMCE.tmceChange( e ); } ); }";
		return $init;
	}
	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles( $hook ) {
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Boldgrid_Seo_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Boldgrid_Seo_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		if ( ! in_array( $hook, array ( 'post.php','post-new.php' ) )
			|| ! in_array( $GLOBALS['post_type'], $this->admin->post_types() ) ) {
				return;
		} # || )

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
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Boldgrid_Seo_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Boldgrid_Seo_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
		if ( ! in_array( $hook, array ( 'post.php','post-new.php' ) ) || ! in_array( $GLOBALS['post_type'], $this->admin->post_types() ) ) {
			return;
		}

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
			array ( 'jquery' ),
			$this->configs['version'],
			false
		);
	}
}
