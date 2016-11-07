<?php
/**
 * Class for handling sections in the BoldGrid SEO plugin.
 * Sections house groups of controls.  Multiple sections can
 * be added to a manager.
 *
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

/**
 * Base section class.
 *
 * @since  1.0.0
 * @access public
 */
class Boldgrid_Seo_Section extends ButterBean_Section {

	/**
	 * The type of section.
	 *
	 * @since  1.3.1
	 * @access public
	 * @var    string
	 */
	public $type = 'bgseo';

	/**
	 * The type of section.
	 *
	 * @since  1.3.1
	 * @access public
	 * @var    string
	 */
	public $analysis;

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */
	public function to_json() {
		$this->json['manager']     = $this->manager->name;
		$this->json['name']        = $this->name;
		$this->json['type']        = $this->type;
		$this->json['icon']        = preg_match( '/dashicons-/', $this->icon ) ? sprintf( 'dashicons %s', sanitize_html_class( $this->icon ) ) : esc_attr( $this->icon );
		$this->json['label']       = $this->label;
		$this->json['description'] = $this->description;
		$this->json['analysis']    = $this->analysis;
		$this->json['active']      = $this->is_active();
	}
}
