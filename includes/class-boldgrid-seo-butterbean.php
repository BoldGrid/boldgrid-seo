<?php
class Boldgrid_Seo_Butterbean {
	public function __construct( $configs ) {
		$this->configs = $configs;
		$this->util = new Boldgrid_Seo_Util();
	}
	public function load() {
		require_once( BOLDGRID_SEO_PATH . '/includes/lib/butterbean/butterbean.php' );
	}

	/**
	 * Get custom templates and load them in to render in our metabox.
	 *
	 * @since 1.2.1
	 */
	public function get_html_template( $located, $slug ) {
		if ( $slug === 'dashboard' ) {
			$located = plugin_dir_path( dirname( __FILE__ ) ) . "/assets/partials/control-dashboard.php";
		}

		return $located;
	}

	public function register( $butterbean, $post_type ) {
		if ( 'page' !== $post_type && 'post' !== $post_type )
			return;
		/* === Register Managers === */
		$butterbean->register_manager( 'boldgrid_seo', $this->configs['meta-box']['manager'] );
		$manager  = $butterbean->get_manager( 'boldgrid_seo' );
		if ( ! class_exists( 'Boldgrid_Seo_Control_Dashboard' ) ) {
			include_once plugin_dir_path( __FILE__ ) . "/class-boldgrid-seo-control-dashboard.php";
		}
		$butterbean->register_control_type( 'dashboard', 'Boldgrid_Seo_Control_Dashboard' );
		/* === Register Sections === */
		$sections = $this->configs['meta-box']['section'];
		foreach( $sections as $section => $settings ) {
			$manager->register_section( $section, $settings );
		}
		/* === Register Controls === */


		$controls = $this->configs['meta-box']['control'];
		$controls['bgseo_canonical']['attr']['placeholder'] = ( isset( $_GET['post'] ) && ! empty( $_GET['post'] ) ) ? get_permalink( $_GET['post'] ) : '';
		foreach( $controls as $control => $settings ) {
			$manager->register_control( $control, $settings );
		}

		/* === Register Settings === */
		$manager->register_setting(
			'bgseo_title',
			array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
		);
		$manager->register_setting(
			'bgseo_description',
			array( 'sanitize_callback' => 'wp_kses_post' )
		);
		$manager->register_setting(
			'bgseo_canonical',
			array( 'sanitize_callback' => 'esc_url_raw' )
		);
		$manager->register_setting(
			'bgseo_robots_index',
			array(
				'default' => 'index',
				'sanitize_callback' => 'sanitize_key'
			)
		);
		$manager->register_setting(
			'bgseo_robots_follow',
			array(
				'default' => 'follow',
				'sanitize_callback' => 'sanitize_key'
			)
		);
	}
}
?>
