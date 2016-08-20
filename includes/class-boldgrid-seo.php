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
defined( 'WPINC' ) ?  : die();
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
	 * The current version of the plugin.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var string $version The current version of the plugin.
	 */
	protected $version;

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
		$this->version = '1.0.0';
		$this->prefix = 'boldgrid-seo';
		$this->load_dependencies();
		$this->assign_configs();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->boldgrid_seo_meta_fields();
		$this->boldgrid_seo_meta_boxes();
		$this->boldgrid_seo_breadcrumbs();

		// Load the config and update classes in the admin pages:
		if ( is_admin() ) {
			// Add an action to load the update class on init:
			add_action( 'init', array (
				$this,
				'load_boldgrid_seo_update'
			) );
		}
	}

	/**
	 * Load the BoldGrid SEO update class
	 */
	public function assign_configs() {
		$configs = new Boldgrid_Seo_Config();
		$this->configs = $configs->get_configs();
	}

	/**
	 * Load the BoldGrid SEO update class
	 */
	public function load_boldgrid_seo_update() {
		// Load and check for plugin updates.
		require_once BOLDGRID_SEO_PATH . '/includes/class-boldgrid-seo-update.php';

		$boldgrid_seo_update = new Boldgrid_Seo_Update();
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
		/*
		 * The class responsible for loading the configs.
		 */
		require_once BOLDGRID_SEO_PATH . '/includes/class-boldgrid-seo-config.php';

		/*
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once BOLDGRID_SEO_PATH . '/includes/class-boldgrid-seo-loader.php';

		/*
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once BOLDGRID_SEO_PATH . '/includes/class-boldgrid-seo-i18n.php';

		/*
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once BOLDGRID_SEO_PATH . '/admin/class-boldgrid-seo-admin.php';

		/*
		 * The class responsible for defining the actions for the meta fields in BoldGrid SEO.
		 */
		require_once BOLDGRID_SEO_PATH . '/admin/class-boldgrid-seo-meta-fields.php';

		/*
		 * The class responsible for defining the meta boxes used for BoldGrid SEO.
		 */
		require_once BOLDGRID_SEO_PATH . '/admin/class-boldgrid-seo-meta-boxes.php';

		/*
		 * The class responsible for adding breadcrumb options for a BoldGrid theme.
		 */
		require_once BOLDGRID_SEO_PATH . '/admin/class-boldgrid-seo-breadcrumbs.php';

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
	private function define_admin_hooks() {
		$plugin_admin = new Boldgrid_Seo_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
		$this->loader->add_action( 'wp_loaded', $plugin_admin, 'register_field_groups' );

		$this->loader->add_action( 'wp_head', $plugin_admin, 'wp_head', 1 );
		$this->loader->add_action( "{$this->prefix}/seo/description", $plugin_admin,
			'meta_description' );
		$this->loader->add_action( "{$this->prefix}/seo/keywords", $plugin_admin, 'meta_keywords' );
		$this->loader->add_action( "{$this->prefix}/seo/classification", $plugin_admin,
			'meta_classification' );
		$this->loader->add_action( "{$this->prefix}/seo/site_name", $plugin_admin,
			'meta_site_name' );
		$this->loader->add_action( "{$this->prefix}/seo/og:title", $plugin_admin, 'meta_og_title' );
		$this->loader->add_action( "{$this->prefix}/seo/og:image", $plugin_admin, 'meta_og_image' );
		$this->loader->add_action( "{$this->prefix}/seo/og:type", $plugin_admin, 'meta_og_type' );
		$this->loader->add_action( "{$this->prefix}/seo/permalink", $plugin_admin,
			'meta_permalink' );

		$this->loader->add_filter( 'boldgrid/seo/archive_title', $plugin_admin,
			'boldgrid_seo_simplify_archive_title' );
		$this->loader->add_filter( 'tiny_mce_before_init', $plugin_admin, 'boldgrid_tinymce_init' );
		$this->loader->add_filter( "{$this->prefix}/seo/add_image_field", $plugin_admin,
			'manual_image', 99 );

		// Check version for updated filters
		$wp_version = version_compare( get_bloginfo( 'version' ), '4.4', '>=' );
		if ( $wp_version ) {
			$this->loader->add_filter( 'pre_get_document_title', $plugin_admin, 'wp_title', 99, 2 );
		} else {
			$this->loader->add_filter( 'wp_title', $plugin_admin, 'wp_title', 99, 2 );
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
		$plugin_meta_field = new Boldgrid_SEO_Meta_Field( $this->get_prefix(),
			$this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( "{$this->prefix}/meta/add_field", $plugin_meta_field,
			'add_field', 10, 2 );
		$this->loader->add_action( "{$this->prefix}/meta/create_field", $plugin_meta_field,
			'create_field' );
		$this->loader->add_action( "{$this->prefix}/meta/update_field", $plugin_meta_field,
			'update_field', 10, 4 );

		$this->loader->add_filter( "{$this->prefix}/meta/update_value/type=checkbox",
			$plugin_meta_field, 'update_checkbox', 10, 3 );
		$this->loader->add_filter( "{$this->prefix}/meta/update_value/type=select",
			$plugin_meta_field, 'update_select', 10, 3 );
	}

	/**
	 * Register all of the hooks related to the Meta Boxes
	 * in the plugin in the Page and Post editors.
	 *
	 * @since 1.0.0
	 * @access private
	 */
	private function boldgrid_seo_meta_boxes() {
		$plugin_meta_boxes = new Boldgrid_SEO_Meta_Box( $this->get_prefix(),
			$this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( "{$this->prefix}/meta/create_box", $plugin_meta_boxes,
			'create_box' );
		$this->loader->add_action( 'add_meta_boxes', $plugin_meta_boxes, 'add_boxes' );
		$this->loader->add_action( "{$this->prefix}/meta/register_field_group", $plugin_meta_boxes,
			'register_field_group' );
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
		$plugin_breadcrumbs = new Boldgrid_SEO_Breadcrumbs();
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

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since 1.0.0
	 * @return string The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}
}
