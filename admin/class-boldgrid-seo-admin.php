<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Boldgrid_Seo
 * @subpackage Boldgrid_Seo/admin
 * @author     BoldGrid <support@boldgrid.com>
 * @link       https://boldgrid.com
 * @since      1.0.0
 */
// If called directly, abort.
defined( 'WPINC' ) ? : die;

$class_name = 'Boldgrid_Seo_Admin';

if ( ! class_exists( $class_name ) ) :

class Boldgrid_Seo_Admin {
	/**
	 * The unique prefix for BoldGrid SEO.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $prefix         The string used to uniquely prefix for BoldGrid SEO.
	 */
	protected $prefix;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $settings       The array used for settings.
	 */
	protected $settings;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * @since    1.0.0
	 */

	public function __construct(  ) {

		$this->prefix      = 'boldgrid-seo';
		$this->plugin_name = strtolower( __CLASS__ );
		$this->version     = '1.0.0';

		$this->settings    = array(

			'post_types'        => array( '' ),

			'meta_fields'       => array(

				'description'      => '<meta property="og:description" name="description" content="%s">',
				'keywords'         => '<meta name="keywords" content="%s">',
				'classification'   => '<meta property="og:classification" content="%s">',
				'site_name'        => '<meta property="og:site_name" name="copyright" content="%s">',
				'title'            => '<meta property="og:title" content="%s">',
				'image'            => '<meta property="og:image" content="%s">',
				'type'             => '<meta property="og:type" content="%s">',

			),

			'field_groups'      => array (

				array (

					'id'              => $this->plugin_name,
					'title'           => __( 'Search Engine Optimization', $this->plugin_name ),
					'fields'          => array (

						array (
							'label'         => __( 'SEO Title', $this->plugin_name ),
							'name'          => 'meta_title',
							'type'          => 'textarea',
							'placeholder'   => $this->boldgrid_titles(  ),
							'instructions'  => __( 'This is <b>very important</b> for Google and Bing, see the Help Tab for more information.  Limit is %d characters.', $this->plugin_name ),
							'maxlength'     => 70,
						),

						array (
							'label'         => __( 'Meta Description', $this->plugin_name ),
							'name'          => 'meta_description',
							'type'          => 'textarea',
							'instructions'  => __( 'Typically what will show in a <b>S</b>earch <b>E</b>ngine <b>R</b>esults <b>P</b>age ( SERP ).  This is important, but secondary to your SEO Title.  Limit is %d characters.', $this->plugin_name ),
							'maxlength'     => 156,
						),

						array (
							'label'         => __( 'Meta Keywords', $this->plugin_name ),
							'name'          => 'meta_keywords',
							'type'          => 'text',
							'placeholder'	=> '',
							'instructions'  => __( 'We recommend using only one or two keywords. Too many keywords can actually hurt your SEO.', $this->plugin_name ),
						),

						array (
							'label'         => __( 'Open Graph Image', $this->plugin_name ),
							'name'          => 'meta_image',
							'type'          => 'image',
							'instructions'  => __( 'Used by some social media sites when a user shares this content.', $this->plugin_name ),
						),

						array (
							'label'         => __( 'Open Graph Type', $this->plugin_name ),
							'name'          => 'meta_type',
							'type'          => 'text',
							'instructions'  => __( 'Used by some social media sites when a user shares this content.', $this->plugin_name ),
						),

					),

					'post_types'      => array(),
					'menu_order'      => 0,
					'context'         => 'normal',
					'priority'        => 'low',
					'label_placement' => 'top',

				),

			),

		);

		$this->settings = apply_filters( "{$this->prefix}/seo/settings", $this->settings );

	}

	/**
	 * The prefix BoldGrid SEO prefix for actions and filters.
	 *
	 * @since     1.0.0
	 * @return    string    The prefix 'boldgrid-seo'.
	 */
	public function get_prefix(  ) {

		return $this->prefix;

	}

	/**
	 * The name of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin 'boldgrid_seo'.
	 */
	public function get_plugin_name(  ) {

		return $this->plugin_name;

	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version(  ) {

		return $this->version;

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

			|| ! in_array( $GLOBALS['post_type'], $this->boldgrid_post_types(  ) ) ) {

				return;

			} # || )

			wp_enqueue_style(
				$this->plugin_name,

				plugin_dir_url( __FILE__ ) .

				'/css/boldgrid-seo-admin.css',

				array(  ),

				$this->version, 'all'

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
		if ( ! in_array( $hook, array ( 'post.php','post-new.php' ) )

			|| ! in_array( $GLOBALS['post_type'], $this->boldgrid_post_types(  ) ) ) {

				return;

			} # || )

			wp_enqueue_script(

				$this->plugin_name,

				plugin_dir_url( __FILE__ ) .

				'js/boldgrid-seo-admin.js',

				array ( 'jquery' ),

				$this->version, false

			);

	}

	/**
	 * Inject JS to have repeater active for TinyMCE content.
	 *
	 * @since 	1.0.0
	 */
	public function boldgrid_tinymce_init( $init ) {

	    $init['setup'] = "function( ed ) { ed.onKeyUp.add( function( ed, e ) { repeater( e ); } ); }";

	    return $init;

	}

	/**
	 * Set the default title per each page & post.
	 *
	 * @since 	1.0.0
	 * @return 	string 	Page Title - Blog Name
	 */
	public function boldgrid_titles() {
		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] && isset( $_GET['post'] ) ) {
			return apply_filters( 'the_title', get_the_title( $_GET['post'] ) ) . ' - ' . get_bloginfo( 'name' );
		}
	}



	/**
	 * Get post types.
	 *
	 * @since	1.0.0
	 */
	public function boldgrid_post_types(  ) {

		$this->settings['post_types'] = get_post_types( array(

			'public' => true

		) );

		unset( $this->settings['post_types']['attachment'] );

		return apply_filters( "{$this->prefix}/seo/post_types",

			apply_filters( "{$this->plugin_name}/post_types",

				$this->settings['post_types'] )

		);

	}

	/**
	 * wp_head
	 *
	 * If automate is turned on, automate the header items.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function wp_head(  ) {

		if ( apply_filters( "{$this->prefix}/seo/automate_head",
			 apply_filters( "{$this->plugin_name}/automate_head", true ) ) ) {

			do_action( "{$this->prefix}/seo/description" 	 	);
			do_action( "{$this->prefix}/seo/keywords" 	  	 	);
			do_action( "{$this->prefix}/seo/classification" 	);
			do_action( "{$this->prefix}/seo/site_name"		 	);
			do_action( "{$this->prefix}/seo/og:title"		 	);
			do_action( "{$this->prefix}/seo/og:image"		 	);
			do_action( "{$this->prefix}/seo/og:type"		 	);

			//do_action( "{$this->prefix}/seo/twitter:title"	 );
			//do_action( "{$this->prefix}/seo/twitter:domain"    );
			//do_action( "{$this->prefix}/seo/twitter:image:src" );

		}

	}

	/**
	 * Meta title.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function wp_title( $title, $sep = "|" ) {

		if ( ! $sep && false !== $sep ) {

			$sep = "|";

		}

		$title = "$title $sep " . get_bloginfo( 'blogname' );

		if ( is_feed(  ) ) {

			return $title;

		}

		$content = $this->seo_title( $sep );

		// Add the site name
		if ( $content ) {

			$title = $content;

		}

		return trim( $title );

	}

	/**
	 * Meta title.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function seo_title( $sep="|" ) {

		if ( ',' != $sep ) {

			$sep = " $sep";

		}

		$content = '';

		global $post, $paged, $page;

		if ( is_404(  ) ) {

			$content = apply_filters( "{$this->prefix}/seo/404_title", "Not Found, Error 404" );

		}

		elseif ( is_archive(  ) ) {

			$content = apply_filters( "{$this->prefix}/seo/archive_title",
				get_the_archive_title(  ) . "$sep " . get_bloginfo( 'blogname' ) );

		}

		elseif ( is_home(  ) ) {

			$posts_page_id = get_option( 'page_for_posts' );
			$front_page_id = get_option( 'page_on_front' );

			// If pages are default with home being posts and a site meta exists
			if ( ! $posts_page_id

				&& ! $front_page_id

				&& $meta = get_option( 'options_meta_title' ) ) {

					$content = $meta;

			}

			// Look for a custom meta on a posts page
			elseif ( $posts_page_id

				&& $meta = get_post_meta( $posts_page_id, 'meta_title', true ) ) {

					$content = $meta;

			}

			// Look for a posts page title
			elseif ( $posts_page_id

				&& $meta = get_the_title( $posts_page_id ) ) {

					$content = "$meta$sep " . get_bloginfo( 'blogname' );

			// Use a default that can be filtered
			} else {

				$content = apply_filters( "{$this->prefix}/seo/home_title", get_bloginfo( 'blogname' ) );

			}

		} else {

			// Look for a custom meta title and override post title
			if ( ! empty( $GLOBALS['post']->ID ) ) {

				if ( $meta_title = get_post_meta( $GLOBALS['post']->ID, 'meta_title', true ) ) {

					$content = $meta_title;

				}

				elseif ( $meta_title = get_the_title( $GLOBALS['post']->ID ) ) {

					$content = "$meta_title$sep " . get_bloginfo( 'blogname' );

				}

			}

		}

		// Add pagination
		if ( $content

			&& ( 1 < $GLOBALS['paged']

			||   1 < $GLOBALS['page'] ) ) {

				$content .= "$sep Page " . max( $GLOBALS['paged'], $GLOBALS['page'] );

		}

		return $content;

	}

	/**
	 * Meta description.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_description(  ) {
		$content = '';

		if ( is_archive(  ) ) {

			$content = apply_filters( "{$this->prefix}/seo/archive_description",

				strip_tags(

					str_replace(

						array ( "\r","\n" ),

						'',

						term_description(  )

					)

				)

			);

		}

		elseif ( is_home(  ) ) {

			$posts_page_id = get_option( 'page_for_posts' );
			$front_page_id = get_option( 'page_on_front' );

			// If pages are default with home being posts and a site meta exists
			if (   ! $posts_page_id

				&& ! $front_page_id

				&& $meta = get_option( 'options_meta_description' ) ) {

					$content = $meta;

			}

			// Look for a custom meta on a posts page
			elseif ( $posts_page_id

				&& $meta = get_post_meta( $posts_page_id, 'meta_description', true ) ) {

					$content = $meta;

			}

			// Look for a posts page content
			elseif ( $posts_page_id

				&& $meta = get_post_field( 'post_content', $posts_page_id ) ) {

					$content = wp_trim_words( $meta, '30', '' );

			}

		} else {

			if ( ! empty( $GLOBALS['post']->ID )

				&& $meta = get_post_meta( $GLOBALS['post']->ID, 'meta_description', true ) ) {

					$content = $meta;
			}

			elseif ( ! empty( $GLOBALS['post']->ID )

				&& $meta = get_post_field( 'post_content', $GLOBALS['post']->ID ) ) {

					$content = wp_trim_words( $meta, '30', '' );

			}

		}

		if ( $content ) : printf( $this->settings['meta_fields']['description'] . "\n", $content ); endif;

	}

	/**
	 * Meta Keywords.
	 *
	 * @since	1.0.0
	 */
	public function meta_keywords(  ) {


		$content = '';

		if ( apply_filters( "{$this->prefix}/seo/add_keywords", false ) ) {

			if ( is_home(  ) ) {

				$posts_page_id = get_option( 'page_for_posts' );
				$front_page_id = get_option( 'page_on_front' );

				// If pages are default with home being posts and a site meta exists
				if (   ! $posts_page_id

					&& ! $front_page_id

					&& $meta = get_option( 'options_meta_keywords' ) ) {

						$content = $meta;

				}

				// Look for a custom meta on a posts page
				elseif ( $posts_page_id

					&& $meta = get_post_meta( $posts_page_id, 'meta_keywords', true ) ) {

						$content = $meta;

				}

			} else {

				if ( ! empty( $GLOBALS['post']->ID )

					&& $meta = get_post_meta( $GLOBALS['post']->ID, 'meta_keywords', true ) ) {

						$content = $meta;

				}

			}

			if ( $content ) {

				printf( $this->settings['meta_fields']['keywords'] . "\n", $content );

			}

		}

	}

	/**
	 * Meta classification.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_classification(  ) {

		if ( $meta = get_option( 'meta_classification' ) ) :

			printf( $this->settings['meta_fields']['classification'] . "\n", $meta );

		endif;

	}

	/**
	 * Twitter domain.
	 *
	 * @since 	1.0.0
	 */
	public function meta_twitter_domain(  ) {

		$content = '';

		( $meta = get_option( 'meta_title' ) ? $content = $meta : $content = get_option( 'blogname' ) );

		if ( $content ) : printf( $this->settings['meta_fields']['twitter_domain'] . "\n", $content ); endif;

	}

	/**
	 * Twitter title.
	 *
	 * @since	1.0.0
	 */
	public function meta_twitter_title(  ) {

		$content = $this->seo_title( ',' );

		if ( $content ) : printf( $this->settings['meta_fields']['twitter_title'] . "\n", $content ); endif;

	}

	/**
	 * Site name.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_site_name(  ) {

		$content = '';

		( $meta = get_option( 'meta_title' ) ? $content = $meta : $content = get_option( 'blogname' ) );

		if ( $content ) : printf( $this->settings['meta_fields']['site_name'] . "\n", $content ); endif;

	}

	/**
	 * Open Graph title.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_og_title(  ) {
		$content = $this->seo_title( ',' );
		if ( $content ) : sprintf( $this->settings['meta_fields']['title'] . "\n", $content );
		endif;
	}

	/**
	 * Open Graph image from featured image.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_og_image(  ) {

		$content = '';

		if ( is_home(  )

			&& $meta = get_option( 'meta_image' ) ) {

				$content = $meta;

		}

		elseif ( ! empty( $GLOBALS['post']->ID )

			&& $meta = apply_filters( "{$this->prefix}/seo/add_image_field", $GLOBALS['post']->ID ) ) {

				$content = $meta;

		}

		elseif ( ! empty( $GLOBALS['post']->ID )

			&& $meta = get_post_meta( $GLOBALS['post']->ID, 'meta_image', true ) ) {

				$content = $meta;

		}

		elseif ( ! empty( $GLOBALS['post']->ID )

			&& $meta_array = wp_get_attachment_image_src( get_post_thumbnail_id( $GLOBALS['post']->ID ), 'full' ) ) {

				if ( ! empty( $meta_array[0] ) ) {

					$content = $meta_array[0];

				}

		}

		if ( $content ) : printf( $this->settings['meta_fields']['image'] . "\n", $content ); endif;

	}

	/**
	 * Open graph type.
	 *
	 * @since	1.0.0
	 */
	public function meta_og_type(  ) {

		$content = '';

		if ( ! empty( $GLOBALS['post']->ID )

			&& $meta = get_post_meta( $GLOBALS['post']->ID, 'meta_type', true ) ) {

				$content = $meta;

		}

		elseif ( $meta = get_option('meta_type') ) {

			$content = $meta;

		}

		if ( $content ) {

			printf( $this->settings['meta_fields']['type'] . "\n", $content );

		}

	}

	/**
	 * Open graph URL.
	 *
	 * @since	1.0.0
	 */
	public function meta_permalink(  ) {

		if ( is_home(  ) ) : $posts_page_id = get_option( 'page_for_posts' );

			// Look for a permalink on a posts page
			if ( $posts_page_id

				&& $meta = get_post_meta( $posts_page_id, 'meta_title', true ) ) {

				echo $meta;

			}

			// Look for a posts page post permalink
			elseif ( $posts_page_id

				&& $meta = get_the_title( $posts_page_id ) ) {

				echo $meta;

			}

			// Else echo the home url
			else {

				echo home_url( '/' );

			}

		else : echo get_permalink(  );

		endif;

	}

	/**
	 * Image override returns false by default.
	 *
	 * @since	1.0.0
	 */
	public function manual_image( $post_id ) {

		if ( is_numeric( $post_id ) ) {

			return false;

		} else {

			return $post_id;

		}

	}

	/**
	 * Add the meta box.
	 *
	 * @since	1.0.0
	 */
	public function register_field_groups(  ) {

		// locations for this field group
		if ( $post_types = $this->boldgrid_post_types(  ) ) {

			foreach ( $post_types as $post_type ) {

				$this->settings['field_groups'][0]['post_types'][] = $post_type;

			}

		}

		foreach ( $this->settings['field_groups'][0]['fields'] as $key => &$field ) {

			if ( empty( $field ) ) {

				continue;

			}

			// Remove keywords or open graph image field unless asked for
			if ( ('meta_keywords' == $field['name']

					&& ! apply_filters( "{$this->prefix}/seo/add_keywords", false ) )

				|| ('meta_type' == $field['name']

					&& ! apply_filters( "{$this->prefix}/seo/add_type", false ) )

				|| ('meta_image' == $field['name']

					&& ! apply_filters( "{$this->prefix}/seo/add_image", false ) )

			) {

				unset( $this->settings['field_groups'][0]['fields'][$key] );
				continue;

			}

			// Add max length to instructions
			if ( ! empty( $field['maxlength'] ) ) {

				$field['instructions'] = sprintf( $field['instructions'], $field['maxlength'] );

			}

		}

		foreach ( $this->settings['field_groups'] as $field_group ) {

			do_action( "{$this->prefix}/meta/register_field_group", $field_group );

		}

	}

}

unset( $class_name );

function boldgrid_seo_simplify_archive_title( $title ) {

	$delimiter = ': ';

	$array     = explode( $delimiter, $title );

	if ( 1 < count( $array ) ) {

		array_shift( $array );

		return implode( $delimiter, $array );

	}

	return $title;

}

endif;
