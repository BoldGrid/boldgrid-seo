<?php
/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrod.com>
 */

/**
 * BoldGrid SEO Script and Style Enqueue
 */
class Boldgrid_Seo_Scripts {
	protected $configs;
	public function __construct( $configs ) {
		$this->configs = $configs;
	}
	public function tiny_mce( $init ) {
		$init['setup'] = "function( editor ) { editor.on('keyup', function ( e ) { BOLDGRID.SEO.TinyMCE.tmceChange( e ); } ); }";
		return $init;
	}
}
