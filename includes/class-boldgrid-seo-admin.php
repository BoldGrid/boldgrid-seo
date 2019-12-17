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

		return apply_filters( "{$this->prefix}/seo/post_types", apply_filters( "{$this->plugin_name}/post_types", $this->settings['post_types'] ) );
	}

	/**
	 * wp_head
	 *
	 * If automate is turned on, automate the header items.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function wp_head() {
		do_action( "{$this->prefix}/seo/before"             );
		do_action( "{$this->prefix}/seo/description" 	 	);
		do_action( "{$this->prefix}/seo/robots" 	 	    );
		do_action( "{$this->prefix}/seo/canonical" 	 	    );
		do_action( "{$this->prefix}/seo/og:locale"          );
		do_action( "{$this->prefix}/seo/og:type"            );
		do_action( "{$this->prefix}/seo/og:title"		 	);
		do_action( "{$this->prefix}/seo/og:description"		);
		do_action( "{$this->prefix}/seo/og:url"             );
		do_action( "{$this->prefix}/seo/og:site_name"		);
		do_action( "{$this->prefix}/seo/og:image"		 	);
		do_action( "{$this->prefix}/seo/after"              );
	}

	/**
	 * Set the title.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function wp_title( $title, $sep = "|" ) {
		if ( ! $sep && false !== $sep ) {
			$sep = "|";
		}

		$site_title = esc_attr( get_bloginfo( 'blogname' ) ); // Not esc_html - used for meta tag attributes output.

		$title = "$title $sep $site_title";

		if ( is_feed() ) {
			return $title;
		}

		$content = $this->seo_title( $sep );

		// Add the site name
		if ( $content ) {
			$title = $content;
		}

		// Validate seo_title format returned and fix any uncaught
		$correct_format = "$sep $site_title";

		$title_length = strlen( $title );
		$correct_format_length = strlen( $correct_format );

		if ( $title_length < $correct_format_length ) {
			if ( substr_compare( $title, $correct_format, $title_length - $correct_format_length, $correct_format_length ) === 0 ) {
				$match = ", $site_title";
				$match_pos = strrpos( $title, $match );

				if ( $match_pos !== false ) {
					$title = substr_replace( $title, " $sep $site_title", $match_pos, strlen( $match ) );
				}
			}
		}

		return $title;
	}

	/**
	 * Ouput Canonical URL markup.
	 *
	 * Markup is stored in the admin configs of this plugin: `$configs['admin']['meta_fields']['canonical']`.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function canonical_url() {
		global $wp_query, $posts;

		// Get custom canonical URL defaults.
		$content = $this->util->get_url( $wp_query );

		if ( ! empty( $GLOBALS['post']->ID ) ) {
			$canonical = get_post_meta( $GLOBALS['post']->ID, 'bgseo_canonical', true );

			// Look for a custom canonical url to override the default permalink.
			if ( ! empty( $canonical ) ) {
				$content = $canonical;
			}
		}

		// Ouput markup.
		if ( ! empty( $content ) ) {
			remove_action( 'wp_head', 'rel_canonical' ); // @since 1.6.3 - Remove core provided canonical markup.
			printf( $this->settings['meta_fields']['canonical'] . "\n", esc_url( $content ) );
		}
	}

	/**
	 * Meta title.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function seo_title( $sep = "|" ) {
		if ( ',' != $sep ) {
			$sep = " $sep";
		}

		$content = '';

		global $post, $paged, $page;

		if ( is_404() ) {
			$content = apply_filters( "{$this->prefix}/seo/404_title", "Not Found, Error 404" );
		}

		elseif ( is_archive() ) {
			$content = get_the_archive_title() . "$sep " . get_bloginfo( 'blogname' );
			$content = $this->simplify_archive_title( $content );
		}

		elseif ( is_search() ) {
			$s = get_search_query();
			$content = apply_filters( "{$this->prefix}/seo/search_title", 'Search for ' . "$s$sep " . get_bloginfo( 'blogname' ) );
		}

		elseif ( is_home() ) {
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
				&& $meta = get_post_meta( $posts_page_id, 'bgseo_title', true ) ) {
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
				if ( $meta_title = get_post_meta( $GLOBALS['post']->ID, 'bgseo_title', true ) ) {
					$content = $meta_title;
				}

				elseif ( $meta_title = get_the_title( $GLOBALS['post']->ID ) ) {
					$content = "$meta_title$sep " . get_bloginfo( 'blogname' );
				}
			}
		}

		// Add pagination
		if ( $content && ( 1 < $GLOBALS['paged'] || 1 < $GLOBALS['page'] ) ) {
			$paginated_title_format = array(
				$sep,
				$this->settings['i18n']['page'],
				max( $GLOBALS['paged'], $GLOBALS['page'] ),
			);

			$content .= implode( ' ', $paginated_title_format );
		}

		return wp_strip_all_tags( $content );
	}

	public function simplify_archive_title( $title ) {
		$delimiter = ': ';
		$array     = explode( $delimiter, $title );
		if ( 1 < count( $array ) ) {
			array_shift( $array );
			return implode( $delimiter, $array );
		}
		return $title;
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
		} elseif ( is_home() ) {
			$posts_page_id = get_option( 'page_for_posts' );
			// Look for custom meta on a posts page.
			if ( $posts_page_id
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
				&& $meta = get_post_meta( $GLOBALS['post']->ID, 'meta_description', true ) ) {
					update_post_meta( $GLOBALS['post']->ID, 'bgseo_description', $meta );
					delete_post_meta( $GLOBALS['post']->ID, 'meta_description' );
					$content = get_post_meta( $GLOBALS['post']->ID, 'bgseo_description', true );
			}
			elseif ( ! empty( $GLOBALS['post']->ID )
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
	 * Site name.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_site_name(  ) {
		$site_name = get_option( 'blogname' );
		if ( $site_name ) : printf( $this->settings['meta_fields']['site_name'] . "\n", $site_name ); endif;
	}

	/**
	 * Open Graph title.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_og_title() {
		$content = $this->seo_title( ',' );
		if ( is_author() ) {
			$content = str_replace( ',', ' |', $content );
		}
		if ( $content ) {
			printf( $this->settings['meta_fields']['title'] . "\n", $content );
		}
	}

	public function meta_og_url() {
		global $wp_query, $posts;
		$content = $this->util->get_url( $wp_query );
		if ( ! empty( $GLOBALS['post']->ID ) && $canonical = get_post_meta( $GLOBALS['post']->ID, 'bgseo_canonical', true ) ) {
			// Look for a custom canonical url to override the default permalink.
			$content = $canonical;
		}
		if ( ! empty( $content ) ) : printf( $this->settings['meta_fields']['og_url'] . "\n", esc_url( $content ) ); endif;
	}

	/**
	 * Open Graph image from featured image.
	 *
	 * @since	1.0.0
	 * @return	void
	 */
	public function meta_og_image(  ) {
		$content = '';
		// Check for feature image and use this as the open graph image.
		if ( ! empty( $GLOBALS['post']->ID )
			&& $meta = wp_get_attachment_image_src( get_post_thumbnail_id( $GLOBALS['post']->ID ), 'full' ) ) {
				if ( ! empty( $meta[0] ) ) {
					$content = $meta[0];
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
		/*
		 * Allow other plugins to handle the robots meta data.
		 *
		 * @since 1.6.4
		 *
		 * @param bool $run Whether or not to add meta robots.
		 */
		$run = true;
		$run = apply_filters( $this->prefix . '/seo/robots/run', $run );
		if ( ! $run ) {
			return;
		}

		$follow = 'follow';
		$index  = 'index';
		if ( is_404() || is_search() ) {
			$index = 'noindex';
		}

		// By default, we set follow and index. If a post is overriding that, make those changes now.
		if ( ! empty( $GLOBALS['post']->ID ) ) {
			$post_follow = get_post_meta( $GLOBALS['post']->ID, 'bgseo_robots_follow', true );
			$follow      = ! empty( $post_follow ) ? $post_follow : $follow;

			$post_index  = get_post_meta( $GLOBALS['post']->ID, 'bgseo_robots_index', true );
			$index       = ! empty( $post_index ) ? $post_index : $index;
		}

		printf( $this->settings['meta_fields']['robots'] . "\n", esc_attr( $index ), esc_attr( $follow ) );
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

	public function meta_og_site_name() {
		$name = get_bloginfo( 'name' );
		printf( $this->settings['meta_fields']['og_site_name'] . "\n", $name );
	}
}
