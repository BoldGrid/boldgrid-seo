<?php

/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Helptab
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrod.com>
 */

/**
 * Boldgrid Seo Helptab Class
 *
 * Responsible for adding the helptab to the editor.
 *
 * @since 1.6.3
 */
class Boldgrid_Seo_Helptab {
	/**
	 * Add our help tab.
	 *
	 * @since 1.6.3
	 */
	public function add() {
		$screen = get_current_screen();

		$args = array(
			'id'      => 'boldgrid_seo',
			'title'   => 'BoldGrid Easy SEO',
			'content' => '<p>' . wp_kses(
				sprintf(
					// translators: 1 opening anchor tag to the Getting Started Guides, 2 its closing anchor tag, 3 opening anchor tag to Facebook user group.
					__( 'If you have any questions on getting started with BoldGrid Easy SEO, please visit our %1$sGetting Started Guide%2$s. We also suggest joining our %3$sTeam Orange User Group community%2$s for free support, tips and tricks.', 'boldgrid-backup' ),
					'<a href="https://www.boldgrid.com/support/boldgrid-easy-seo/" target="_blank">',
					'</a>',
					'<a href="https://www.facebook.com/groups/BGTeamOrange" target="_blank">'
				),
				array(
					'a' => array(
						'href'   => array(),
						'target' => array(),
					),
				)
			) . '</p>',
		);

		$screen->add_help_tab( $args );
	}
}
