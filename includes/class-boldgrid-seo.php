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
	 * The plugins configs.
	 *
	 * @since 1.0.0
	 * @access protected
	 * @var array An array of the plugins configurations.
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
		$this->plugin_name = 'boldgrid-easy-seo';
		$this->prefix = 'boldgrid-seo';
		$this->load_dependencies();
		$this->set_locale();
		$this->boldgrid_seo_config();
		$this->upgrade();
		$this->boldgrid_seo_admin();
		$this->load_butterbean();
		$this->enqueue_scripts();
		$this->register_meta();
	}
	/**
	 * Load the BoldGrid SEO JS and CSS Files.
	 */
	public function enqueue_scripts() {
		$scripts = new Boldgrid_Seo_Scripts( $this->configs );
		$this->loader->add_action( 'admin_enqueue_scripts', $scripts, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $scripts, 'enqueue_scripts' );
		$this->loader->add_filter( 'tiny_mce_before_init', $scripts, 'tiny_mce' );
	}

	/**
	 * Load the BoldGrid SEO update class
	 */
	public function boldgrid_seo_config() {
		$configs = new Boldgrid_Seo_Config();
		$this->configs = $configs->get_configs();
	}

	public function upgrade() {
		$upgrade = new Boldgrid_Seo_Upgrade( $this->configs );
		$this->loader->add_action( 'plugins_loaded', $upgrade, 'upgrade_db_check' );

	}
	/**
	 * Load the BoldGrid SEO update class
	 */
	public function load_butterbean() {
		$butterbean = new Boldgrid_Seo_Butterbean( $this->configs );
		$this->loader->add_action( 'plugins_loaded', $butterbean, 'load' );
		//$this->loader->add_action( 'load-post-new.php', $butterbean, 'load' );
		$this->loader->add_action( 'butterbean_register', $butterbean, 'register', 10, 2 );
		// Add our custom template checks.
		$this->loader->add_filter( 'butterbean_control_template', $butterbean, 'get_html_template', 10, 2 );
	}

	/**
	 * Register meta values so they can show up in the REST API.
	 *
	 * @since 1.6.5
	 *
	 * @return void
	 */
	public function register_meta() {
		$meta = new Boldgrid_Seo_Meta( $this->configs );
		$this->loader->add_filter( 'init', $meta, 'register' );
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
		$plugin_file = plugin_dir_path( dirname( __FILE__ ) ) . $this->plugin_name . '.php';
		$plugin_i18n->set_domain( implode( get_file_data( $plugin_file , array( 'Version' ), 'plugin' ) ) );
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
		$this->loader->add_action( 'wp_head', $admin, 'wp_head', 1 );
		$this->loader->add_action( "{$this->prefix}/seo/description", $admin, 'meta_description' );
		$this->loader->add_action( "{$this->prefix}/seo/robots", $admin, 'robots' );
		$this->loader->add_action( "{$this->prefix}/seo/canonical", $admin, 'canonical_url' );
		$this->loader->add_action( "{$this->prefix}/seo/og:locale", $admin, 'meta_og_locale' );
		$this->loader->add_action( "{$this->prefix}/seo/og:title", $admin, 'meta_og_title' );
		$this->loader->add_action( "{$this->prefix}/seo/og:site_name", $admin, 'meta_og_site_name' );
		$this->loader->add_action( "{$this->prefix}/seo/og:type", $admin, 'meta_og_type' );
		$this->loader->add_action( "{$this->prefix}/seo/og:url", $admin, 'meta_og_url' );
		$this->loader->add_action( "{$this->prefix}/seo/og:description", $admin, 'meta_og_description' );
		$this->loader->add_action( "{$this->prefix}/seo/og:image", $admin, 'meta_og_image' );

		// Check version for updated filters
		$wp_version = version_compare( get_bloginfo( 'version' ), '4.4', '>=' );
		if ( $wp_version ) {
			$this->loader->add_filter( 'pre_get_document_title', $admin, 'wp_title', 99, 2 );
		} else {
			$this->loader->add_filter( 'wp_title', $admin, 'wp_title', 99, 2 );
		}
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
