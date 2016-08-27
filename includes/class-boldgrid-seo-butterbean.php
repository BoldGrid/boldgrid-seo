<?php
class Boldgrid_Seo_Butterbean {
	public function __construct( $configs ) {
		$this->configs = $configs;
		$this->util = new Boldgrid_Seo_Util();
	}
	public function load() {
		require_once( BOLDGRID_SEO_PATH . '/includes/lib/butterbean/butterbean.php' );
	}

	public function register( $butterbean, $post_type ) {
		if ( 'page' !== $post_type && 'post' !== $post_type )
			return;
		/* === Register Managers === */
		$butterbean->register_manager(
			'boldgrid_seo',
			array(
				'label'     => 'BoldGrid SEO',
				'post_type' => array( 'post', 'page' ),
				'context'   => 'normal',
				'priority'  => 'high',
			)
		);
		$manager  = $butterbean->get_manager( 'boldgrid_seo' );
		/* === Register Sections === */
		$manager->register_section(
			'bgseo_meta',
			array(
				'label' => 'Title & Description',
				'icon'  => 'dashicons-edit'
			)
		);
		$manager->register_section(
			'bgseo_visibility',
			array(
				'label' => 'Search Visibility',
				'icon'  => 'dashicons-visibility'
			)
		);
		$manager->register_section(
			'bbe_color_fields',
			array(
				'label' => 'Color Fields',
				'icon'  => 'dashicons-art'
			)
		);
		$manager->register_section(
			'bbe_radio_fields',
			array(
				'label' => 'Radio Fields',
				'icon'  => 'dashicons-carrot'
			)
		);
		$manager->register_section(
			'bbe_special_fields',
			array(
				'label' => 'Special Fields',
				'icon'  => 'dashicons-star-filled'
			)
		);
		/* === Register Controls === */
		$manager->register_control(
				'boldgrid_seo_title',
				array(
					'type'        => 'text',
					'section'     => 'bgseo_meta',
					'attr'        => array(
						'placeholder' => $this->util->meta_title(),
						'class' => 'widefat'
					),
					'label'       => 'SEO Title',
					'description' => 'This is your SEO Title',
				)
		);
		$manager->register_control(
			'boldgrid_seo_description',
			array(
				'type'        => 'textarea',
				'section'     => 'bgseo_meta',
				'attr'        => array(
					'placeholder' => $this->util->meta_description(),
					'class' => 'widefat',
				),
				'label'       => 'SEO Description',
				'description' => 'Example description.'
			)
		);
		$manager->register_control(
			'bbe_checkbox_a',
			array(
				'type'        => 'checkbox',
				'section'     => 'bgseo_visibility',
				'label'       => 'Example Checkbox',
				'description' => 'Example description.'
			)
		);
		$manager->register_control(
			'bbe_checkboxes_a',
			array(
				'type'        => 'checkboxes',
				'section'     => 'bgseo_visibility',
				'label'       => 'Example Checkbox',
				'description' => 'Example description.',
				'choices'     => array(
					'choice_d' => 'Choice D',
					'choice_e' => 'Choice E',
					'choice_f' => 'Choice F',
				)
			)
		);
		$manager->register_control(
			'bbe_radio_a',
			array(
				'type'        => 'radio',
				'section'     => 'bbe_radio_fields',
				'label'       => 'Example Radio',
				'description' => 'Example description.',
				'choices'     => array(
					''         => 'None',
					'choice_a' => 'Choice A',
					'choice_b' => 'Choice B',
					'choice_c' => 'Choice C',
				)
			)
		);
		$manager->register_control(
			'bbe_select_a',
			array(
				'type'        => 'select',
				'section'     => 'bbe_common_fields',
				'label'       => 'Example Select',
				'description' => 'Example description.',
				'choices'     => array(
					''         => '',
					'choice_x' => 'Choice X',
					'choice_y' => 'Choice Y',
					'choice_z' => 'Choice Z'
				)
			)
		);
		$manager->register_control(
			'bbe_select_b',
			array(
				'type'        => 'select-group',
				'section'     => 'bbe_common_fields',
				'label'       => 'Example Select B',
				'description' => 'Example description.',
				'choices'  => array(
					'' => '',
					array(
						'label' => esc_html__( 'Citrus', 'hcct' ),
						'choices' => array(
							'grapefruit' => esc_html__( 'Grapefruit', 'hcct' ),
							'lemon'      => esc_html__( 'Lemon',      'hcct' ),
							'lime'       => esc_html__( 'Lime',       'hcct' ),
							'orange'     => esc_html__( 'Orange',     'hcct' ),
						)
					),
					array(
						'label'   => esc_html__( 'Melons', 'hcct' ),
						'choices' => array(
							'banana-melon' => __( 'Banana',     'hcct' ),
							'cantaloupe'   => __( 'Cantaloupe', 'hcct' ),
							'honeydew'     => __( 'Honeydew',   'hcct' ),
							'watermelon'   => __( 'Watermelon', 'hcct' )
						)
					)
				)
			)
		);
		$manager->register_control(
			'bbe_color_a',
			array(
				'type'        => 'color',
				'section'     => 'bbe_color_fields',
				'label'       => 'Pick a color',
				'description' => 'Example description.',
			)
		);
		$manager->register_control(
			'bbe_palette_a',
			array(
				'type'        => 'palette',
				'section'     => 'bbe_color_fields',
				'label'       => 'Pick a color palette',
				'description' => 'Example description.',
				'choices'     => array(
					'cilantro' => array(
						'label' => __( 'Cilantro', 'hcct' ),
						'colors' => array( '99ce15', '389113', 'BDE066', 'DB412C' )
					),
					'quench' => array(
						'label' => __( 'Quench', 'hcct' ),
						'colors' => array( '#82D9F5', '#7cc7dc', '#60A4B9', '#a07096' )
					),
					'cloudy-days' => array(
						'label' => __( 'Cloudy Days', 'hcct' ),
						'colors' => array( '#E2735F', '#eaa16e', '#FBDF8B', '#ffe249' )
					)
				)
			)
		);
		$uri = trailingslashit( plugin_dir_url(  __FILE__ ) );
		$manager->register_control(
			'bbe_radio_image_a',
			array(
				'type'        => 'radio-image',
				'section'     => 'bbe_radio_fields',
				'label'       => 'Example Radio Image',
				'description' => 'Example description.',
				'choices' => array(
					'horizon' => array(
						'url'   => $uri . 'images/horizon-thumb.jpg',
						'label' => __( 'Horizon', 'hcct' )
					),
					'orange-burn' => array(
						'url'   => $uri . 'images/orange-burn-thumb.jpg',
						'label' => __( 'Orange Burn', 'hcct' )
					),
					'planet-burst' => array(
						'url'   => $uri . 'images/planet-burst-thumb.jpg',
						'label' => __( 'Planet Burst', 'hcct' )
					),
					'planets-blue' => array(
						'url'   => $uri . 'images/planets-blue-thumb.jpg',
						'label' => __( 'Blue Planets', 'hcct' )
					),
					'space-splatters' => array(
						'url'   => $uri . 'images/space-splatters-thumb.jpg',
						'label' => __( 'Space Splatters', 'hcct' )
					)
				)
			)
		);
		$manager->register_control(
			'bbe_image_a',
			array(
				'type'        => 'image',
				'section'     => 'bbe_special_fields',
				'label'       => 'Example Image',
				'description' => 'Example description.'
			)
		);
		$manager->register_control(
			'bbe_date_a',
			array(
				'type'        => 'date',
				'section'     => 'bbe_special_fields',
				'label'       => 'Example Date',
				'description' => 'Example description.'
			)
		);
		$manager->register_control(
			'bbe_multiavatars_a',
			array(
				'type'        => 'multi-avatars',
				'section'     => 'bbe_special_fields',
				'label'       => 'Example Multi Avatars',
				'description' => 'Example description.',
			)
		);
		/* === Register Settings === */
		$manager->register_setting(
			'bbe_text_a',
			array( 'sanitize_callback' => 'wp_filter_nohtml_kses' )
		);
		$manager->register_setting(
			'bbe_textarea_a',
			array( 'sanitize_callback' => 'wp_kses_post' )
		);
		$manager->register_setting(
			'bbe_checkbox_a',
			array( 'sanitize_callback' => 'butterbean_validate_boolean' )
		);
		$manager->register_setting(
			new ButterBean_Setting_Array(
				$manager,
				'bbe_checkboxes_a',
				array( 'sanitize_callback' => 'sanitize_key' )
			)
		);
		$manager->register_setting(
			'bbe_radio_a',
			array( 'sanitize_callback' => 'sanitize_key' )
		);
		$manager->register_setting(
			'bbe_select_a',
			array( 'sanitize_callback' => 'sanitize_key' )
		);
		$manager->register_setting(
			new ButterBean_Setting_Datetime(
				$manager,
				'bbe_date_a'
			)
		);
		$manager->register_setting(
			'bbe_color_a',
			array( 'sanitize_callback' => 'sanitize_hex_color_no_hash' )
		);
		$manager->register_setting(
			'bbe_palette_a',
			array( 'sanitize_callback' => 'sanitize_key' )
		);
		$manager->register_setting(
			'bbe_image_a',
			array( 'sanitize_callback' => 'absint' )
		);
		$manager->register_setting(
			new ButterBean_Setting_Array(
				$manager,
				'bbe_multiavatars_a',
				array( 'sanitize_callback' => 'absint' )
			)
		);
	}
}
?>
