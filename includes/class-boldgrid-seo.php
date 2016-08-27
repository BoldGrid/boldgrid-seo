<?php

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since 1.0.0
 * @package Boldgrid_Seo
 * @subpackage Boldgrid_Seo/includes
 * @author BoldGrid <support@boldgrid.com>
 * @link https://boldgrid.com
 */

// If this file is called directly, abort.
defined( 'WPINC' ) ? : die();
class Boldgrid_Seo {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var Boldgrid_Seo_Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var string $plugin_name The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The plugins configs
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $configs    An array of the plugins configurations
	 */
	protected $configs = array();

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->plugin_name = 'boldgrid-seo';
		$this->prefix = 'boldgrid-seo';
		$this->load_dependencies();
		$this->set_locale();
		$this->boldgrid_seo_config();
		$this->boldgrid_seo_admin();
//		$this->boldgrid_seo_meta_fields();
//		$this->boldgrid_seo_meta_boxes();
//		$this->boldgrid_seo_breadcrumbs();
		$this->boldgrid_seo_update();
		$this->load_butterbean();
	}

	/**
	 * Load the BoldGrid SEO update class
	 */
	public function boldgrid_seo_config() {
		$configs = new Boldgrid_Seo_Config();
		$this->configs = $configs->get_configs();
	}

	/**
	 * Load the BoldGrid SEO update class
	 */
	public function load_butterbean() {
		$butterbean = new Boldgrid_Seo_Butterbean( $this->configs );
		$this->loader->add_action( 'plugins_loaded', $butterbean, 'load' );
		//$this->loader->add_action( 'load-post-new.php', $butterbean, 'load' );
		$this->loader->add_action( 'butterbean_register', $butterbean, 'register', 10, 2 );
	}

	/**
	 * Load the BoldGrid SEO update class
	 */
	public function boldgrid_seo_update() {
		$update = new Boldgrid_Seo_Update( $this->configs );
		// If DOING_CRON, then check if this plugin should be auto-updated.
		if ( defined( 'DOING_CRON' ) && DOING_CRON ){
			// Ensure required definitions for pluggable.
			defined( 'AUTH_COOKIE' ) || define( 'AUTH_COOKIE', null );
			defined( 'LOGGED_IN_COOKIE' ) || define( 'LOGGED_IN_COOKIE', null );
			// Load the pluggable class, if needed.
			require_once ABSPATH . 'wp-includes/pluggable.php';
			$update->wp_update_this_plugin();
		}
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Boldgrid_Seo_Loader. Orchestrates the hooks of the plugin.
	 * - Boldgrid_Seo_i18n. Defines internationalization functionality.
	 * - Boldgrid_Seo_Admin. Defines all hooks for the admin area.
	 * - Boldgrid_Seo_Meta_Field. Defines all the hooks for the Metaboxes in Page/Post Editor
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function load_dependencies() {
		$this->loader = new Boldgrid_Seo_Loader();
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Boldgrid_Seo_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function set_locale() {
		$plugin_i18n = new Boldgrid_Seo_i18n();
		$plugin_i18n->set_domain( $this->get_plugin_name() );
		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function boldgrid_seo_admin() {
		$admin = new Boldgrid_Seo_Admin( $this->configs );
		$this->loader->add_action( 'admin_enqueue_scripts', $admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $admin, 'enqueue_scripts' );
//		$this->loader->add_action( 'wp_loaded', $admin, 'register_field_groups' );
		$this->loader->add_action( 'wp_head', $admin, 'wp_head', 1 );
		$this->loader->add_action( "{$this->prefix}/seo/description", $admin, 'meta_description' );
//		$this->loader->add_action( "{$this->prefix}/seo/keywords", $admin, 'meta_keywords' );
//		$this->loader->add_action( "{$this->prefix}/seo/classification", $admin, 'meta_classification' );
//		$this->loader->add_action( "{$this->prefix}/seo/site_name", $admin, 'meta_site_name' );
//		$this->loader->add_action( "{$this->prefix}/seo/og:title", $admin, 'meta_og_title' );
//		$this->loader->add_action( "{$this->prefix}/seo/og:image", $admin, 'meta_og_image' );
//		$this->loader->add_action( "{$this->prefix}/seo/og:type", $admin, 'meta_og_type' );
//		$this->loader->add_action( "{$this->prefix}/seo/permalink", $admin, 'meta_permalink' );
//		$this->loader->add_filter( 'boldgrid/seo/archive_title', $admin, 'boldgrid_seo_simplify_archive_title' );
//		$this->loader->add_filter( 'tiny_mce_before_init', $admin, 'boldgrid_tinymce_init' );
//		$this->loader->add_filter( "{$this->prefix}/seo/add_image_field", $admin, 'manual_image', 99 );

		// Check version for updated filters
		$wp_version = version_compare( get_bloginfo( 'version' ), '4.4', '>=' );
		if ( $wp_version ) {
			$this->loader->add_filter( 'pre_get_document_title', $admin, 'wp_title', 99, 2 );
		} else {
			$this->loader->add_filter( 'wp_title', $admin, 'wp_title', 99, 2 );
		}
	}

	/**
	 * Register all of the hooks related to the Meta Field areas
	 * of the plugin in the Page and Post editors.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function boldgrid_seo_meta_fields() {
		$plugin_meta_field = new Boldgrid_Seo_Meta_Field( $this->get_prefix(), $this->get_plugin_name(), $this->configs );
		$this->loader->add_action( "{$this->prefix}/meta/add_field", $plugin_meta_field, 'add_field', 10, 2 );
		$this->loader->add_action( "{$this->prefix}/meta/create_field", $plugin_meta_field, 'create_field' );
		$this->loader->add_action( "{$this->prefix}/meta/update_field", $plugin_meta_field, 'update_field', 10, 4 );
		$this->loader->add_filter( "{$this->prefix}/meta/update_value/type=checkbox", $plugin_meta_field, 'update_checkbox', 10, 3 );
		$this->loader->add_filter( "{$this->prefix}/meta/update_value/type=select", $plugin_meta_field, 'update_select', 10, 3 );
	}

	/**
	 * Register all of the hooks related to the Meta Boxes
	 * in the plugin in the Page and Post editors.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function boldgrid_seo_meta_boxes() {
		$plugin_meta_boxes = new Boldgrid_Seo_Meta_Box( $this->get_prefix(), $this->get_plugin_name(), $this->configs );
		$this->loader->add_action( "{$this->prefix}/meta/create_box", $plugin_meta_boxes, 'create_box' );
		$this->loader->add_action( 'add_meta_boxes', $plugin_meta_boxes, 'add_boxes' );
		$this->loader->add_action( "{$this->prefix}/meta/register_field_group", $plugin_meta_boxes, 'register_field_group' );
		$this->loader->add_action( 'save_post', $plugin_meta_boxes, 'save_boxes' );
	}

	/**
	 * Register Hook for adding Breadcrumbs to BoldGrid Theme.
	 * Add any filters to override.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function boldgrid_seo_breadcrumbs() {
		$plugin_breadcrumbs = new Boldgrid_Seo_Breadcrumbs( $this->configs );
		$this->loader->add_action( 'boldgrid_add_breadcrumbs', $plugin_breadcrumbs, 'boldgrid_breadcrumbs' );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since 1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since 1.0.0
	 * @return string The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since 1.0.0
	 * @return Boldgrid_Seo_Loader Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * The unique prefix used in the plugin.
	 *
	 * @since 1.0.0
	 * @return string The prefix used for BoldGrid SEO.
	 */
	public function get_prefix() {
		return $this->prefix;
	}
}
