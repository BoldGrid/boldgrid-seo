<?php

/**
 * The meta box class.
 *
 * Add metaboxes to the page and post editor screen.
 *
 * @since      1.0.0
 * @package    Boldgrid_SEO
 * @subpackage Boldgrid_SEO/Boldgrid_SEO_Meta_Field
 * @author     BoldGrid.com
 */

// If this file is called directly, abort.
defined( 'WPINC' ) ? : die;

if (! class_exists('Boldgrid_SEO_Meta_Field') ) :

class Boldgrid_SEO_Meta_Field {
	/**
	 * The unique prefix for BoldGrid SEO.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $prefix         The string used to uniquely prefix for BoldGrid SEO.
	 */
	protected $prefix;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version        The current version of the plugin.
	 */
	protected $version;

	/**
	 * The settings of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $settings       The array used for settings.
	 */
	protected $settings;

	/**
	 * All of the fields.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $settings       The array used for settings.
	 */
	protected $fields;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * @since    1.0.0
	 */
	public function __construct( $prefix, $plugin_name, $version ) {

		$this->prefix      = $prefix;
		$this->plugin_name = $plugin_name;
		$this->version     = $version;

	}

	/**
	 * Retrieves the fields
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function add_field( $field, $field_group ) {

		$group_id = false;

		if ( is_array( $field_group ) && ! empty( $field_group['id'] ) ) {

			$group_id = $field_group['id'];

		} elseif ( is_string(  ) ) {

			$group_id = $field_group;

		}

		if ( ! $group_id ) {

			return;

		}

		$this->fields[ $group_id ][ $field['name'] ] = $field;

	}

	/**
	 * Builds the fields
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function create_field( $field ) {

		// defaults
		$field = wp_parse_args( $field, array(

			'label'        => '',
			'name'         => '',
			'type'         => 'text',
			'value'        => null,
			'instructions' => '',
			'required'     => 0,
			'id'           => '',
			'class'        => '',
			'parent'       => 0,
			'wrapper'      => array(

				'width'       => '',
				'class'       => '',
				'id'          => '',

			),

			'_id'          => '',
			'_name'        => '',

		) );

		$this->render_field( $field );
	}

	/**
	 * Escape an array of html attributes in key=>value format.
	 *
	 * @since	1.0.0
	 * @return	string		The escaped attributes
	 */
	public function esc_attrs( $atts ) {

		$output = '';

		foreach ( $atts as $k => $v ) {
			$output .= ' ' . $k . '="' . esc_attr( $v ) . '"';
		}

		return trim( $output );

	}

	/**
	 * Save the meta value for field.
	 *
	 * @since	1.0.0
	 * @return	void.
	 */
	public function update_field( $post_id, $name, $field_group, $value ) {

		if ( ! $post_id || ! $name || ! $field_group ) {

			return;

		}

		$group_id = false;

		if ( is_array( $field_group ) && ! empty( $field_group['id'] ) ) {

			$group_id = $field_group['id'];

		} elseif ( is_string(  ) ) {

			$group_id = $field_group;

		}

		if ( ! $group_id ) {

			return;

		}

		// get the field
		$field = $this->get_field( $name, $group_id );

		if (! $field ) {

			return;

		}

		// filter for 3rd party customization
		$value = apply_filters( "{$this->prefix}/meta/update_value", $value, $post_id, $field );
		$value = apply_filters( "{$this->prefix}/meta/update_value/type={$field['type']}", $value, $post_id, $field );
		$value = apply_filters( "{$this->prefix}/meta/update_value/name={$field['name']}", $value, $post_id, $field );

		// post
		if ( is_numeric($post_id) ) {

			// allow to save to revision!
			update_metadata('post', $post_id, $field['name'], $value );

		}
		// user
		elseif ( false !== strpos( $post_id, 'user_' ) ) {

			$user_id = str_replace( 'user_', '', $post_id );
			update_metadata( 'user', $user_id, $field['name'], $value );

		}
		// comment
		elseif ( false !== strpos( $post_id, 'comment_' ) ) {

			$comment_id = str_replace( 'comment_', '', $post_id );
			update_metadata( 'comment', $comment_id, $field['name'], $value );

		// option
		} else {

			$value = stripslashes_deep($value);
			update_option( $post_id . '_' . $field['name'], $value );

		}

	}

	/**
	 * Get the field from the fields added to array.
	 *
	 * @since	1.0.0
	 * @return	array|bool	Field settings array on success, or false.
	 */
	public function get_field( $name, $group_id ) {

		if ( ! empty( $this->fields[ $group_id ][ $name ] ) ) {

			return $this->fields[ $group_id ][ $name ];

		}

		return false;

	}

	/**
	 * Base for most fields
	 *
	 * @since	1.0.0
	 * @return	string		HTML for field.
	 */
	public function render_field( $field ) {

		$input = '';

		if ( method_exists( $this, $field['type'] ) ) {

			$field['_id']   = $field['id'];
			$field['id']    = "{$this->prefix}-field-{$field['name']}";

			$field['_name'] = $field['name'];
			$field['name']  = "{$this->prefix}[{$field['name']}]";

			$input = call_user_func_array( array ( $this, $field['type'] ), array ( $field ) );

		}

		if ( ! $input ) {

			return false;

		}

		$classes = array(

			"{$this->prefix}-field",
			"{$this->prefix}-field-{$field['type']}",
			$field['id'],

		);

		if ( $field['wrapper']['class'] ) {

			$classes[] = $field['wrapper']['class'];

		}

		$atts = array(

			'class'     => implode( ' ', $classes ),
			'data-name' => $field['_name'],
			'data-type' => $field['type'],

		);

		if ( $field['wrapper']['id'] ) {

			$atts[] = $field['wrapper']['id'];

		}
?>

		<div <?php echo $this->esc_attrs( $atts ); ?>>
			<div class="<?php echo $this->prefix; ?>-label">
				<label for="<?php echo $field['id']; ?>"><?php echo $field['label']; ?></label>
				<p class="description"><?php echo $field['instructions']; ?></p>
			</div>
			<div class="<?php echo $this->prefix; ?>-input">
				<?php echo $input; ?>
			</div>
		</div>

<?php
	}


	/**
	 * Field: text
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function text( $field ) {

		$field = wp_parse_args( $field, array(

			'default_value'	=> '',
			'maxlength'		=> '',
			'placeholder'	=> '',
			'prepend'		=> '',
			'append'		=> '',
			'readonly'		=> 0,
			'disabled'		=> 0,

		) );

		// vars
		$o = array( 'type',
					'id',
					'class',
					'name',
					'value',
					'placeholder'
				);

		$s = array( 'readonly',
					'disabled'
				);

		$e = '';

		// maxlength
		if ( $field['maxlength'] ) {

			$o[] = 'maxlength';

		}

		// prepend
		if ( $field['prepend'] ) {

			$field['class'] .= ' acf-is-prepended';
			$e .= '<div class="acf-input-prepend">' . $field['prepend'] . '</div>';

		}

		// append
		if ( $field['append'] ) {

			$field['class'] .= ' acf-is-appended';
			$e .= '<div class="acf-input-append">' . $field['append'] . '</div>';

		}

		// populate atts
		$atts = array(  );

		foreach ( $o as $k ) {

			if ( $field[$k] ) {

				$atts[ $k ] = $field[ $k ];

			}

		}

		// special atts
		foreach( $s as $k ) {

			if ( $field[ $k ] ) {

				$atts[ $k ] = $k;

			}

		}

		// render
		$e .= '<div class="acf-input-wrap">';
		$e .= '<input ' . $this->esc_attrs( $atts ) . ' />';
		$e .= '</div>';

		return $e;
	}

	/**
	 * Field: hidden
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function hidden_input( $atts ) {

		$atts['type'] = 'hidden';
		echo '<input ' . $this->esc_attrs( $atts ) . ' />';

	}


	/**
	 * Field: textarea
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function textarea( $field ) {

		$field = wp_parse_args( $field, array(

			'default_value'	=> '',
			'new_lines'		=> '',
			'maxlength'		=> '',
			'placeholder'	=> '',
			'readonly'		=> 0,
			'disabled'		=> 0,
			'rows'			=> '',

		) );

		// vars
		$o = array( 'id', 'class', 'name', 'placeholder', 'rows' );
		$s = array( 'readonly', 'disabled' );
		$e = '';

		// maxlength
		if ( $field['maxlength'] ) {

			$o[] = 'maxlength';

		}

		// rows
		if ( empty( $field['rows'] ) ) {

			$field['rows'] = 8;

		}

		// populate atts
		$atts = array(  );

		foreach ( $o as $k ) {

			if ( ! empty( $field[$k] ) ) {

				$atts[ $k ] = $field[ $k ];

			}

		}

		// special atts
		foreach( $s as $k ) {

			if ( $field[ $k ] ) {

				$atts[ $k ] = $k;

			}

		}

		$e .= '<textarea ' . $this->esc_attrs( $atts ) . '>';
		$e .= esc_textarea( $field['value'] );
		$e .= '</textarea>';

		return $e;

	}


	/**
	 * Extract from an array a value into a variable. Removes the value from the array.
	 *
	 * @since	1.0.0
	 * @return	string		The variable.
	 */
	public function extract_var( &$array, $key ) {

		// check if exists
		if ( is_array( $array )

			&& array_key_exists( $key, $array ) ) {

			// store value
			$v = $array[ $key ];

			// unset
			unset( $array[ $key ] );

			// return
			return $v;

		}

		// return
		return null;

	}

	/**
	 * Field: select
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function select( $field ) {

		$field = wp_parse_args( $field, array(

			'multiple' 		=> 0,
			'allow_null' 	=> 0,
			'choices'		=> array(  ),
			'default_value'	=> '',
			'ui'			=> 0,
			'ajax'			=> 0,
			'placeholder'	=> '',
			'disabled'		=> 0,
			'readonly'		=> 0,

		) );

		// vars
		$s = array( 'readonly', 'disabled' );
		$e = '';

		// add empty value (allows '' to be selected)
		if ( empty( $field['value'] ) ) {

			$field['value'][''] = '';

		}

		// placeholder
		if ( empty( $field['placeholder'] ) ) {

			$field['placeholder'] = __( "Select", $this->plugin_name );

		}

		// vars
		$atts = array(
			'id'				=> $field['id'],
			'class'				=> $field['class'],
			'name'				=> $field['name'],
			'data-multiple'		=> $field['multiple'],
		);

		// multiple
		if ( $field['multiple'] ) {

			$atts['multiple'] = 'multiple';
			$atts['size']     = 5;
			$atts['name']    .= '[]';

		}

		// special atts
		foreach( $s as $k ) {

			if ( $field[ $k ] ) {

				$atts[ $k ] = $k;

			}

		}

		// vars
		$els     = array(  );
		$choices = array(  );

		// loop through values and add them as options
		if ( ! empty( $field['choices'] ) ) {

			foreach ( $field['choices'] as $k => $v ) {

				if ( is_array( $v ) ) {

					// optgroup
					$els[] = array( 'type' => 'optgroup', 'label' => $k );

					if ( ! empty( $v ) ) {

						foreach ( $v as $k2 => $v2 ) {

							$els[] = array( 'type' => 'option', 'value' => $k2, 'label' => $v2, 'selected' => in_array( $k2, $field['value'] ) );
							$choices[] = $k2;

						}

					}

					$els[] = array ( 'type' => '/optgroup' );

				} else {

					$els[] = array ( 'type'  => 'option',
									 'value' => $k,
									 'label' => $v,
									 'selected' => in_array( $k, $field['value'] ) );

					$choices[] = $k;

				}

			}

		}

		if ( $field['allow_null'] ) {

			array_unshift( $els,

				array ( 'type'  => 'option',
					    'value' => '',
					    'label' => '- ' . $field['placeholder'] . ' -' )
				);

		}

		// html
		$e .= '<select ' . acf_esc_attr( $atts ) . '>';

		// construct html
		if ( ! empty( $els ) ) {

			foreach ( $els as $el ) {

				// extract type
				$type = $this->extract_var( $el, 'type' );

				if ( $type == 'option' ) {

					// get label
					$label = $this->extract_var( $el, 'label' );

					// validate selected
					if ( $this->extract_var( $el, 'selected' ) ) {

						$el['selected'] = 'selected';

					}

					$e .= '<option ' . $this->esc_attrs( $el ) . '>' . $label . '</option>';

				} else {

					$e .= '<' . $type . ' ' . $this->esc_attrs( $el ) . '>';

				}
			}
		}

		$e .= '</select>';

		// return
		return $e;

	}

	/**
	 * Update: select
	 *
	 * @since	1.0.0
	 * @return	$value
	 */
	public function update_select( $value ) {

		// validate
		if ( empty( $value ) ) {

			return $value;

		}

		// array
		if ( is_array( $value ) ) {

			// save value as strings, so we can clearly search for them in SQL LIKE statements
			$value = array_map( 'strval', $value );

		}

		// return
		return $value;

	}


	/**
	 * Field: checkbox
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function checkbox( $field ) {

		$field = wp_parse_args( $field, array(

			'layout'		=> 'vertical',
			'choices'		=> array(  ),
			'default_value'	=> '',

		) );

		// class
		$field['class'] .= ' acf-checkbox-list';
		$field['class'] .= ( ! empty( $field['layout'] ) && 'horizontal' == $field['layout'] ) ? ' acf-hl' : ' acf-bl';

		// e
		$e = '<ul ' . $this->esc_attrs( array( 'class' => $field['class'] ) ) . '>';

		// checkbox saves an array
		$field['name'] .= '[]';

		// foreach choices
		if ( ! empty( $field['choices'] ) ) {

			$i = 0;
			foreach( $field['choices'] as $value => $label ) {

				$i++;

				// vars
				$atts = array(

					'type'	=> 'checkbox',
					'id'	=> $field['id'],
					'name'	=> $field['name'],
					'value'	=> $value,

				);

				if ( in_array( $value, $field['value'] ) ) {

					$atts['checked'] = 'checked';

				}

				if ( isset( $field['disabled'] )

					&& in_array( $value, $field['disabled'] ) ) {

						$atts['disabled'] = 'disabled';

				}

				// each input ID is generated with the $key, however, the first input must not use $key so that it matches the field's label for attribute
				if ( $i > 1 ) {

					$atts['id'] .= '-' . $value;

				}

				$e .= '<li><label><input ' . $this->esc_attrs( $atts ) . ' />' . $label . '</label></li>';

			}

		}

		$e .= '</ul>';

		// return
		return $e;

	}

	/**
	 * Update: checkbox
	 *
	 * @since	1.0.0
	 * @return	$value
	 */
	public function update_checkbox( $value ) {

		// validate
		if ( empty( $value ) ) {

			return $value;

		}

		// array
		if ( is_array( $value ) ) {

			// save value as strings, so we can clearly search for them in SQL LIKE statements
			$value = array_map( 'strval', $value );

		}

		// return
		return $value;

	}


	/**
	 * Field: true_false
	 *
	 * @since	1.0.0
	 * @return	HTML
	 */
	public function true_false( $field ) {

		$field = wp_parse_args( $field, array(

			'default_value'	=> 0,
			'message'		=> '',

		) );

		$e = '';

		// vars
		$atts = array(

			'type'		=> 'checkbox',
			'id'		=> $field['id'],
			'name'		=> $field['name'],
			'value'		=> '1',

		);

		// checked
		if ( ! empty( $field['value'] ) ) {

			$atts['checked'] = 'checked';

		}

		// html
		$e .= '<ul class="' . "{$this->prefix}-checkbox-list {$this->prefix}-bl " . esc_attr( $field['class'] ) . '">';
			$e .= '<li><label><input ' . $this->esc_attrs( $atts ) . ' />' . esc_html( $field['message'] ) . '</label></li>';
		$e .= '</ul>';

		// return
		return $e;

	}

}

endif;