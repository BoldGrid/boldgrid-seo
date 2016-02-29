function repeater( e ) {

    var targetId = e.target.id;

    var text = '';

    switch ( targetId ) {

         case 'content' :

             text = jQuery( '#content' ).val(  );

             break;

		// Grab text from TinyMCE Editor
		case 'tinymce' :

			// Only do this if page/post editor has TinyMCE as active editor.
			if ( tinymce.activeEditor )

				// Define text as the content of the current TinyMCE instance.
				text = tinymce.activeEditor.getContent( {

					// Return only text not html.
					format : 'text'

				// Remove non-breaking spaces from content.
				} );

		break;

    }

    // Clean the text output of remaining HTML.
    var clean_text = boldgrid_stripper( text );

    // keywords from content will be a random keyword chosen from the top repetitive words.
    var keywords = top_words( clean_text, 1 );

    // Select the BoldGrid Meta Keywords box
	jQuery( '#boldgrid-seo-field-meta_keywords' )

		// And add a new placeholder attribute with a suggestion from content.
		.attr( 'placeholder', 'The word ' + keywords[0] + ' appears frequently in this content.' );
    
}

// Strip out remaining traces of HTML to form our clean_text output to scan
function boldgrid_stripper( html ) {

   var tmp = document.implementation.createHTMLDocument( 'New' ).body;

   tmp.innerHTML = html;

   return tmp.textContent

   || tmp.innerText 

   || "";

}

// Just a random number min/max range helper.
function random_keyword( min, max ) {

  return Math.random( ) * ( max - min ) + min;

}

function top_words( text ) {

    // Make it so that Keyword can match keyword, KeyWord, KEYWORD etc through equalization.
    var words = text.toLowerCase(  )

    	// Filter out words a bit to eliminate things like your, I, etc.
    	

    	// Split text on non word characters
    	.split( /\W+/ )

    var positions = new Array(  )

    var word_counts = new Array(  )

    for ( var i = 0; i < words.length; i++ ) {

        var word = words[i].replace( /(\b(\w{1,4})\b(\s|$))/g,'' )

        if ( ! word ) {

            continue

        }

        if ( typeof positions[word] == 'undefined' ) {

            positions[word] = word_counts

            word_counts.push( [word] )

        } else {

            word_counts[positions[word]]++

        }

    }

    // Put most frequent words at the beginning.
    word_counts.sort( function ( a, b ) {

    	return b[1] - a[1]

    } )

    // Return the first n items
    return word_counts

}

// This compares the first string and second string word similarities and gives you a value back out of x percent.
function similar_text( first, second, percent ) {

	if (   first === null

		|| second === null 

		|| typeof first === 'undefined'

		|| typeof second === 'undefined' ) {

		return 0;

	}

	first += '';
	second += '';

	var pos1 = 0,

		pos2 = 0,

		max = 0,

		firstLength = first.length,

		secondLength = second.length,

		p, q, l, sum;

	max = 0;

	for ( p = 0; p < firstLength; p++ ) {

		for ( q = 0; q < secondLength; q++ ) {

			for ( l = 0;

				( p + l < firstLength )

				&& ( q + l < secondLength )

				&& ( first.charAt( p + l ) === second.charAt( q + l ) ); l++ );

			if ( l > max ) {

				max = l;

				pos1 = p;
				
				pos2 = q;

			}

		}

	}

	sum = max;

	if ( sum ) {

		if ( pos1 && pos2 ) {

			sum += this.similar_text(

				first.substr( 0, pos1 ),
				second.substr( 0, pos2 )

			);

		}

		if (   ( pos1 + max < firstLength  )
			&& ( pos2 + max < secondLength ) ) {

				sum += this.similar_text(

					first.substr( pos1 + max, firstLength - pos1 - max ),
					second.substr( pos2 + max, secondLength - pos2 - max )

				);

		}

	}

	if ( ! percent ) {

		return sum;

	} else {

		return ( sum * 200 ) / ( firstLength + secondLength );

	}

};

// count our words in metafields, add some css styles for visual feedback
( function( ) {

	jQuery.fn.extend( {		

		wordcount : function(  ) {

			var $this      = jQuery( this ),

				limit      = $this.attr( 'maxlength' ),

				$counter   = jQuery( '<span />', {

					'class' : 'boldgrid-seo-meta-counter',
					'style' : 'font-weight: bold' 

				} );

				$container = jQuery( '<div />', {

					'class' : 'boldgrid-seo-meta-countdown boldgrid-seo-meta-extra',
					'html'  : ' characters left' 

				} );

			if ( limit ) {

				 $this

					.removeAttr( 'maxlength' )

					.after( $container.prepend( $counter ) )

					.on( 'keyup focus' , function(  ) {

						$counter.set_counter( $this, limit );

					} );
			}

			$counter.set_counter( $this, limit );

		},

		// Set the counter element for meta description and meta title
		set_counter : function( $target, limit ) {

			var $this = jQuery( this ),

				text  = $target.val(  ),

				chars = text.length;

			jQuery( this ).html( limit - chars );

			if ( chars > limit ) {

				$this.css( { 'color' : 'red' } );

			} else if ( chars > 0 && chars < 30 ) {

				$this.css( { 'color' : 'goldenrod' } );

			} else if ( chars > 29 ) {

				$this.css( { 'color' : 'limegreen' } );

			} else {

				$this.css( { 'color' : 'black' } );

			}

		}

	} );

} )(  );

jQuery( document ).ready( function(  ) {

	// Meta Title's textarea's height to set
	var $meta_title_height = jQuery( '#boldgrid-seo-field-meta_title' );

	// Screen Column's partial selector.
	var $wp_screen_columns = '#adv-settings > div.columns-prefs > .columns-prefs-';

	// Check Screen Column tab > Screen Layout and see if the single column radio is marked.
	if( jQuery( $wp_screen_columns + '1 input:radio:checked' ).length > 0 ) {

		// Set to a height of one since it's full width.
		$meta_title_height.attr( 'rows', '1' );

	// Or assume that 2 columns is used since we only have a choice of 1 or 2 columns.
	} else {

		// Set to a height of two since it's much more compact.
		$meta_title_height.attr( 'rows', '2' );

	}
	
	// Delegate event to the 1 column radio to listen for change and activate trigger.
	jQuery( document ).delegate( $wp_screen_columns + '1 input:radio:checked',

		// What to do if change happens.
		'change', function( event ) {

			// We will set the height of the meta title section to one row.
			$meta_title_height.attr( 'rows', '1' );

		}
	);

	// Delegate event to the 2 column radio to listen for change and activate trigger.
	jQuery( document ).delegate( $wp_screen_columns + '2 input:radio:checked',

		// What to do if change happens.
		'change', function( event ) {

			// We will set the height of the meta title section to two rows.
			$meta_title_height.attr( 'rows', '2' );

		}
	);

	// Trigger events on change.
	jQuery( $wp_screen_columns + '2 input:radio:checked' )

		.trigger( 'change' );

	// Set up repeater function to react to a click event once on TinyMCE content first load.
	jQuery( '#content' ).one( 'click', function ( e ) {

		repeater( e );

	} );

	// Trigger our one click event once with a click, obviously.
	jQuery( '#content' ).click( );

	// Apply our wordcount counter to the meta title and meta description textarea fields.
	jQuery( '#boldgrid-seo-field-meta_title, #boldgrid-seo-field-meta_description' )

		.each( function(  ) {

			jQuery( this ).wordcount(  );

		} );

} );

