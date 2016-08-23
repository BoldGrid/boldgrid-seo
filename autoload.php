<?php

if ( ! function_exists( 'boldgrid_seo_autoload' ) ) {
	/**
	 * The Kirki class autoloader.
	 * Finds the path to a class that we're requiring and includes the file.
	 */
	function boldgrid_seo_autoload( $class_name ) {
		$paths = array();
		$our_class = ( 0 === stripos( $class_name, 'Boldgrid_Seo' ) );

		if ( $our_class ) {
			$path     = dirname( __FILE__ ) . '/includes/';
			$is_interface = ( substr( $class_name, -strlen( 'Interface' ) ) == 'Interface' );
			$filename = 'class-' . strtolower( str_replace( '_', '-', $class_name ) ) . '.php';
			if ( $is_interface ) {
				$interface = str_replace( '_Interface', '', $class_name );
				$filename = 'interface-' . strtolower( str_replace( '_', '-', $interface ) ) . '.php';
			}

			$paths[] = $path . $filename;

			$substr   = str_replace( 'Boldgrid_Seo_', '', $class_name );
			$exploded = explode( '_', $substr );
			$levels   = count( $exploded );

			$previous_path = '';
			for ( $i = 0; $i < $levels; $i++ ) {
				$paths[] = $path . $previous_path . strtolower( $exploded[ $i ] ) . '/' . $filename;
				$previous_path .= strtolower( $exploded[ $i ] ) . '/';
			}
			foreach ( $paths as $path ) {
				$path = wp_normalize_path( $path );
				if ( file_exists( $path ) ) {
					include_once $path;
					return;
				}
			}
		}
	}
	// Run the autoloader
	spl_autoload_register( 'boldgrid_seo_autoload' );
}
