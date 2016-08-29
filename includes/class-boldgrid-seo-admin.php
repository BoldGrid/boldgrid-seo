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
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $settings       The array used for settings.
	 */
	protected $settings;

	protected $configs;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * @since    1.0.0
	 */

	public function __construct( $configs ) {
		$this->prefix      = 'boldgrid-seo';
		$this->plugin_name = strtolower( __CLASS__ );
		$this->configs = $configs;
		$this->settings = $this->configs['admin'];
		$this->settings = apply_filters( "{$this->prefix}/seo/settings", $this->settings );
		$this->util = new Boldgrid_Seo_Util();
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
	 * Inject JS to have repeater active for TinyMCE content.
	 *
	 * @since 	1.0.0
	 */
	public function boldgrid_tinymce_init( $init ) {
		$init['setup'] = "function( ed ) { ed.onKeyUp.add( function( ed, e ) { repeater( e ); } ); }";
		return $init;
	}

	/**
	 * Get post types.
	 *
	 * @since	1.0.0
	 */
	public function post_types(  ) {
		$this->settings['post_types'] = get_post_types(
			array(
				'public' => true,
			)
		);

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
			do_action( "{$this->prefix}/seo/robots" 	 	    );
			do_action( "{$this->prefix}/seo/canonical" 	 	    );
			do_action( "{$this->prefix}/seo/keywords" 	  	 	);
			do_action( "{$this->prefix}/seo/classification" 	);
			do_action( "{$this->prefix}/seo/site_name"		 	);
			do_action( "{$this->prefix}/seo/og:locale"          );
			do_action( "{$this->prefix}/seo/og:title"		 	);
			do_action( "{$this->prefix}/seo/og:type"            );
			do_action( "{$this->prefix}/seo/og:description"		);
			do_action( "{$this->prefix}/seo/og:image"		 	);
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
		$title = trim( str_replace( ',', ' |', wp_strip_all_tags( $title ) ) );
		return $title;
	}

	public function canonical_url() {
		if ( ! empty( $GLOBALS['post']->ID ) ) {
			// Look for a custom canonical url to override the default permalink.
			if ( $canonical = get_post_meta( $GLOBALS['post']->ID, 'bgseo_canonical', true ) ) {
				$content = $canonical;
			}
			// Otherwise use the default permalink for page or post.
			elseif ( $canonical = get_permalink( $GLOBALS['post']->ID ) ) {
				$content = $canonical;
			}
		}
		if ( isset( $content ) ) : printf( $this->settings['meta_fields']['canonical'] . "\n", esc_url( $content ) ); endif;
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
				&& $meta = get_post_meta( $posts_page_id, 'boldgrid_seo_title', true ) ) {
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
				if ( $meta_title = get_post_meta( $GLOBALS['post']->ID, 'boldgrid_seo_title', true ) ) {
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
	 * Get the meta description.
	 *
	 * @since	1.2.1
	 * @return	string $content String containing content of meta description.
	 */
	public function get_meta_description() {
		$content = '';

		if ( is_archive() ) {
			$content = apply_filters( "{$this->prefix}/seo/archive_description",
				strip_tags(
					str_replace(
						array ( "\r","\n" ),
						'',
						term_description()
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

			// Look for custom meta on a posts page.
			elseif ( $posts_page_id
				&& $meta = get_post_meta( $posts_page_id, 'bgseo_description', true ) ) {
					$content = $meta;
			}

			// Look for a posts page content.
			elseif ( $posts_page_id
				&& $meta = get_post_field( 'post_content', $posts_page_id ) ) {
					$content = wp_trim_words( $meta, '40', '' );
					$content = $this->util->get_sentences( $content );
			}
		} else {
			if ( ! empty( $GLOBALS['post']->ID )
				&& $meta = get_post_meta( $GLOBALS['post']->ID, 'bgseo_description', true ) ) {
					$content = $meta;
			}
			elseif ( ! empty( $GLOBALS['post']->ID )
				&& $meta = get_post_field( 'post_content', $GLOBALS['post']->ID ) ) {
					$content = wp_trim_words( $meta, '40', '' );
					$content = $this->util->get_sentences( $content );
			}
		}

		return $content;
	}

	public function meta_description() {
		$content = $this->get_meta_description();
		if ( $content ) : printf( $this->settings['meta_fields']['description'] . "\n", $content ); endif;
	}

	public function meta_og_description() {
		$content = $this->get_meta_description();
		if ( $content ) : printf( $this->settings['meta_fields']['og_description'] . "\n", $content ); endif;
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
		if ( is_author() ) {
			$content = str_replace( ',', ' |', wp_strip_all_tags( $content ) );
		}
		if ( $content ) {
			printf( $this->settings['meta_fields']['title'] . "\n", $content );
		}
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
	 * Set metarobots follow/index.
	 *
	 * @since	1.2.1
	 * @return	void
	 */
	public function robots() {
		if ( is_404() ) {
			$follow = 'follow';
			$index = 'noindex';
		}
		if ( ! empty( $GLOBALS['post']->ID ) ) {
			$follow = get_post_meta( $GLOBALS['post']->ID, 'bgseo_robots_follow', true );
			$index = get_post_meta( $GLOBALS['post']->ID, 'bgseo_robots_index', true );
		}
		if ( $follow && $index ) : printf( $this->settings['meta_fields']['robots'] . "\n", esc_attr( $index ), esc_attr( $follow ) ); endif;
	}

	/**
	 * Get the blog's locale for OpenGraph.
	 *
	 * @since 1.2.1
	 */
	public function meta_og_locale() {
		$locale = get_locale();
		printf( $this->settings['meta_fields']['locale'] . "\n", $locale );
	}
	/**
	 * Open graph type.
	 *
	 * @since	1.2.1
	 */
	public function meta_og_type(  ) {
		$type = 'object';
		if ( is_singular() ) {
			$type = 'article';
		}
		if ( is_front_page() || is_home() ) {
			$type = 'website';
		}

		printf( $this->settings['meta_fields']['og_type'] . "\n", $type );
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
				&& $meta = get_post_meta( $posts_page_id, 'boldgrid_seo_title', true ) ) {
				echo $meta;
			}
			// Look for a posts page post permalink
			elseif ( $posts_page_id
				&& $meta = get_the_title( $posts_page_id ) ) {
				echo $meta;
			} else {
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
		if ( $post_types = $this->post_types(  ) ) {
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
