<?php
/**
 * Radio image control class extends the built-in radio control.  This control is
 * meant for displaying an image instead of the radio fields.
 *
 * @package    ButterBean
 * @subpackage Admin
 * @author     Justin Tadlock <justin@justintadlock.com>
 * @copyright  Copyright (c) 2015-2016, Justin Tadlock
 * @link       https://github.com/justintadlock/butterbean
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

/**
 * Radio image control class.
 *
 * @since  1.0.0
 * @access public
 */
class Boldgrid_Seo_Controls_Html extends ButterBean_Control {

	/**
	 * The type of control.
	 *
	 * @since  1.0.0
	 * @access public
	 * @var    string
	 */
	public $type = 'html';

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
	/**
	 * Prints Underscore.js template.
	 *
	 * @since  1.0.0
	 * @access public
	 * @return void
	 */

}
