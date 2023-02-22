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
		// Check how many setences we have left and prepare the string for output.
		$string = $this->construct_sentences( $sentences );

		// Remove whitespace from string.
		$string = trim( $string );

		return $string;
	}

	/**
	 * Construct Sentences.
	 *
	 * This will check out the number of sentences in the
	 * array and format them for output.
	 *
	 * @since 1.2.1
	 *
	 * @param array $sentences An array containing sentences to format.
	 * @return string $string A String containing our formatted sentences.
	 */
	public function construct_sentences( $sentences ) {
		$count = count( $sentences );
		switch( $count ) {
			// Check out a single sentence returned.
			case 1 :
				// Create string with our setence.
				$sentences = implode( '', $sentences ) . '.';
				// If it's a longer sentence it should have ellipses.
				strlen( $sentences ) < 130 ? : $sentences = $sentences . '..';
				break;
			// Two sentences retuned might contain a partial.
			case 2 :
				// Remove the partial sentences from the end.
				array_pop( $sentences );
				// Create single sentence with period at the end.
				$sentences = implode( '', $sentences ) . '.';
				break;
			// Multiple sentences are the most likely scenario.
			default :
				// Remove last sentence since it's likely a partial.
				array_pop( $sentences );
				// Create string with whole sentences and puncuation.
				$sentences = implode( '. ', $sentences );
				// Remove any whitespace for output.
				$sentences = trim( $sentences );
		}
		$string = $sentences;

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
				// Get the first words of the page or post.
				$description = wp_trim_words( strip_shortcodes( $meta ), '30', '' );
				// Trim leading/trailing whitespace and html entities.
				$description = trim( html_entity_decode( $description ), " \t\n\r\0\x0B\xC2\xA0" );
				// Clean up description.
				$description = $this->get_sentences( $description );
		}

		return $description;
	}

	/**
	 * Get the current url from query.
	 *
	 * @thanks All In One SEO for this this approach.
	 *
	 * @since 1.2.1
	 * @return $link A link for the current page in query.
	 */
	public function get_url( $query, $show_page = true ) {
		if ( $query->is_404 || empty( $query->posts ) ) {
			return false;
		}
		$link    = '';
		$haspost = count( $query->posts ) > 0;
		if ( get_query_var( 'm' ) ) {
			$m = preg_replace( '/[^0-9]/', '', get_query_var( 'm' ) );
			switch ( $p ) {
				case 4:
					$link = get_year_link( $m );
					break;
				case 6:
					$link = get_month_link( $this->substr( $m, 0, 4 ), $this->substr( $m, 4, 2 ) );
					break;
				case 8:
					$link = get_day_link( $this->substr( $m, 0, 4 ), $this->substr( $m, 4, 2 ), $this->substr( $m, 6, 2 ) );
					break;
				default:
					return false;
			}
		} elseif ( $query->is_home && ( get_option( 'show_on_front' ) == 'page' ) && ( $pageid = get_option( 'page_for_posts' ) ) ) {
			$link = get_permalink( $pageid );
			$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 0;
			if ( $paged ) {
				$link = $this->get_paged_link( $link, $paged );
			}
		} elseif ( is_front_page() || ( $query->is_home && ( get_option( 'show_on_front' ) != 'page' || ! get_option( 'page_for_posts' ) ) ) ) {
			if ( function_exists( 'icl_get_home_url' ) ) {
				$link = icl_get_home_url();
			} else {
				$link = trailingslashit( home_url() );
			}
			$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 0;
			if ( $paged ) {
				$link = $this->get_paged_link( $link, $paged );
			}
		} elseif ( ( $query->is_single || $query->is_page ) && $haspost ) {
			$post = $query->posts[0];
			$link = get_permalink( $post->ID );
		} elseif ( $query->is_author && $haspost ) {
			$author = get_userdata( get_query_var( 'author' ) );
			if ( false === $author ) {
				return false;
			}
			$link = get_author_posts_url( $author->ID, $author->user_nicename );
		} elseif ( $query->is_category && $haspost ) {
			$link = get_category_link( get_query_var( 'cat' ) );
			$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 0;
			if ( $paged ) {
				$link = $this->get_paged_link( $link, $paged );
			}
		} elseif ( $query->is_tag && $haspost ) {
			$tag = get_term_by( 'slug', get_query_var( 'tag' ), 'post_tag' );
			if ( ! empty( $tag->term_id ) ) {
				$link = get_tag_link( $tag->term_id );
			}
		} elseif ( $query->is_day && $haspost ) {
			$link = get_day_link( get_query_var( 'year' ),
				get_query_var( 'monthnum' ),
				get_query_var( 'day' ) );
		} elseif ( $query->is_month && $haspost ) {
			$link = get_month_link( get_query_var( 'year' ),
				get_query_var( 'monthnum' ) );
		} elseif ( $query->is_year && $haspost ) {
			$link = get_year_link( get_query_var( 'year' ) );
		} elseif ( $query->is_tax && $haspost ) {
			$taxonomy = get_query_var( 'taxonomy' );
			$term     = get_query_var( 'term' );
			if ( ! empty( $term ) ) {
				$link = get_term_link( $term, $taxonomy );
			}
		} elseif ( $query->is_archive && function_exists( 'get_post_type_archive_link' ) && ( $post_type = get_query_var( 'post_type' ) ) ) {
			if ( is_array( $post_type ) ) {
				$post_type = reset( $post_type );
			}
			$link = get_post_type_archive_link( $post_type );
		} elseif ( $query->is_search ) {
			$search_query = get_search_query();
			// Regex catches case when /search/page/N without search term is itself mistaken for search term. R.
			if ( ! empty( $search_query ) && ! preg_match( '|^page/\d+$|', $search_query ) ) {
				$link = get_search_link();
			}
		} else {
			return false;
		}
		if ( empty( $link ) || ! is_string( $link ) ) {
			return false;
		}

		return $link;
	}

	/**
	 * Gets category link with pages
	 *
	 * @since 1.6.9
	 *
	 * @param string $link The category link.
	 * @param int    $pagenum The page number.
	 *
	 * @global $wp_rewrite.
	 *
	 * @return string The link.
	 */
	public function get_paged_link( $link, $pagenum ) {
		global $wp_rewrite;

		if ( $wp_rewrite->using_permalinks() || $wp_rewrite->using_index_permalinks() )
		{
			$link = sprintf(
				'%s/%s/%d/',
				rtrim( $link, '/' ),
				$wp_rewrite->pagination_base,
				$pagenum
			);
		}
		else
		{
			if ( false === strpos( $link, '?' ) ) {
				$link .= '?';
			} else {
				$link .= '&';
			}
			$link .= sprintf( 'paged=%d', $pagenum );
		}

		return $link;
	}
}
