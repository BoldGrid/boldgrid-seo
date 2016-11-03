<?php
/**
 * BoldGrid SEO Keywords Control.
 *
 * This is used to just rendour custom templates within a section.
 *
 * @package    BoldGrid SEO
 * @since      1.3.1
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

/**
 * Radio image control class.
 *
 * @since  1.0.0
 * @access public
 */
class Boldgrid_Seo_Control_Keywords extends ButterBean_Control {

	/**
	 * The type of control.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $type = 'keywords';

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */

	public function to_json() {
		parent::to_json();
		$this->json['value'] = $this->type;
	}
}
