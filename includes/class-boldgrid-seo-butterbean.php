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
	 * Get custom control templates and load them in to render in our metabox.
	 *
	 * @since 1.2.1
	 */
	public function get_html_template( $located, $slug ) {
		// Get the analysis control template.
		if ( $slug === 'dashboard' ) {
			$located = plugin_dir_path( dirname( __FILE__ ) ) . "/assets/partials/control-dashboard.php";
		}
		// Get the keywords control template.
		if ( $slug === 'keywords' ) {
			$located = plugin_dir_path( dirname( __FILE__ ) ) . "/assets/partials/control-keywords.php";
		}
		// Override the default textarea template.
		if ( $slug === 'textarea' ) {
			$located = plugin_dir_path( dirname( __FILE__ ) ) . "/assets/partials/control-bgseo-textarea.php";
		}

		return $located;
	}

	public function register( $butterbean, $post_type ) {
		if ( array_search($post_type, $this->configs['meta-box']['post_types'] ) === false )
			return;
		/* === Register Managers === */
		$butterbean->register_manager( 'boldgrid_seo', $this->configs['meta-box']['manager'] );
		$manager  = $butterbean->get_manager( 'boldgrid_seo' );

		// Custom Analysis Control.
		if ( ! class_exists( 'Boldgrid_Seo_Control_Dashboard' ) ) {
			include_once plugin_dir_path( __FILE__ ) . "/class-boldgrid-seo-control-dashboard.php";
		}
		$butterbean->register_control_type( 'dashboard', 'Boldgrid_Seo_Control_Dashboard' );

		// Custom Keywords Control.
		if ( ! class_exists( 'Boldgrid_Seo_Control_Keywords' ) ) {
			include_once plugin_dir_path( __FILE__ ) . "/class-boldgrid-seo-control-keywords.php";
		}
		$butterbean->register_control_type( 'keywords', 'Boldgrid_Seo_Control_Keywords' );

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
			array( 'sanitize_callback' => function( $setting ) {
				return wp_specialchars_decode( wp_filter_nohtml_kses ( $setting ) );
			} )
		);
		$manager->register_setting(
			'bgseo_description',
			array( 'sanitize_callback' => function( $setting ) {
				return wp_specialchars_decode( wp_kses_post( $setting ) );
			} )
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
		$manager->register_setting(
			'bgseo_custom_keyword',
			array( 'sanitize_callback' => function( $setting ) {
				return wp_specialchars_decode( wp_filter_nohtml_kses ( $setting ) );
			} )
		);

	}
}
?>
