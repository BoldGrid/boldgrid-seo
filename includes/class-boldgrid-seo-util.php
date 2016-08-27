<?php

/**
 * BoldGrid Source Code
 *
 * @package Boldgrid_Seo_Config
 * @copyright BoldGrid.com
 * @version $Id$
 * @author BoldGrid.com <wpb@boldgrod.com>
 */

// Prevent direct calls
if ( ! defined( 'WPINC' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * BoldGrid Form configuration class
 */
class Boldgrid_Seo_Util {
	/**
	 * Prepares our excerpt string.
	 *
	 * This takes our recommended length for a meta
	 * description, and returns only full words back.
	 *
	 * @since   1.2.1
	 *
	 * @param string   $string  String to prepare.
	 * @param int      $length  Max length of string.
	 *
	 * @return string  $string  Prepared string.
	 */
	public function prepare_words( $string, $length ) {
		// Length passed should be an integer value.
		if ( ! is_int( $length ) ) {
			return $string;
		}
		// Recommended Length is 156 Characters for our Meta Description.
		$string = substr( $string, 0, $length );
		// If the string doesn't end with a space and still has spaces.
		if ( substr( $string, -1 ) !== ' ' && substr_count( trim( $string ), ' ' ) > 0 ) {
			// Get the position of the last space.
			$position = strrpos( $string, ' ' );
			// Then remove everything from that point on.
			$string = substr( $string, 0, $position );
		}
		// Trim any whitespace.
		$string = trim( $string );

		return $string;
	}

	/**
	 * Attempts to grab complete sentences from excerpt.
	 *
	 * This calls prepare_words() to reduce string
	 *
	 * @since 1.2.1
	 */
	public function get_sentences( $string ) {
		// Prepare our string.
		$string = $this->prepare_words( $string, 156 );
		// Seperate string into array based on sentences.
		$strings = explode( '.', $string );
		// Avoid abbreviations and numbered lists.
		$sentences = array();
		foreach( $strings as $sentence ) {
			// Construct our sentences string
			if ( strlen( $sentence ) > 2 && ! is_numeric( $sentence ) ) {
				$sentences[] = $sentence;
			}
		}
		// Remove last sentence since it's likely partial if we have more than one.
		$count = count( $sentences );
		if ( $count > 1 ) {
			array_pop( $sentences );
		}
		// Convert array back into a clean string.
		$clean = '';
		foreach( $sentences as $v ) {
			$clean .= "{$v}. ";
		}
		// String is clean.
		$string = trim( $clean );

		return $string;
	}

	/**
	 * Set the default title per each page & post.
	 *
	 * @since   1.0.0
	 * @return  string  Page Title - Blog Name
	 */
	public function meta_title() {
		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] && isset( $_GET['post'] ) ) {
			return apply_filters( 'the_title', get_the_title( $_GET['post'] ) ) . ' - ' . get_bloginfo( 'name' );
		}
	}

	/**
	 * Set the default meta description for each page & post.
	 *
	 * @since   1.2.1
	 * @return  string $description A meta description that will be used by default.
	 */
	public function meta_description() {
		$description = '';
		if ( isset( $_GET['action'] ) && 'edit' === $_GET['action'] &&
			isset( $_GET['post'] ) && $meta = get_post_field( 'post_content', $_GET['post'] ) ) {
				$description = wp_trim_words( $meta, '30', '' );
				$description = $this->get_sentences( $description );
		}

		return $description;
	}
}
