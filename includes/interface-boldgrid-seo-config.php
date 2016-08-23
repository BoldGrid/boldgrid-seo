<?php
interface Boldgrid_Seo_Config_Interface {
	/**
	 * Get configuration options to use within the plugin.
	 *
	 * @since 1.3
	 */
	public function get_configs();

	/**
	 * Include configuration files.
	 *
	 * @since 1.3
	 */
	public function assign_configs();
}
?>
