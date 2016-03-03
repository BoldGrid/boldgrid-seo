function repeater( e ) {
	var targetId, text, cleanText, keywords;

	targetId = e.target.id;
	text = '';
	// Clean the text output of remaining HTML.
	cleanText = boldgridStripper( text );
	// Keywords from content will be a random keyword chosen from the top repetitive words.
	keywords = topWords( cleanText, 1 );

	switch ( targetId ) {
		case 'content' :
			text = jQuery( '#content' ).val(  );
			break;

		// Grab text from TinyMCE Editor.
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

	// Select the BoldGrid Meta Keywords box
	jQuery( '#boldgrid-seo-field-meta_keywords' )
		// And add a new placeholder attribute with a suggestion from content.
		.attr( 'placeholder', 'The word ' + keywords[0] + ' appears frequently in this content.' );
}

// Strip out remaining traces of HTML to form our cleanText output to scan
function boldgridStripper( html ) {
	var tmp;
	
	tmp = document.implementation.createHTMLDocument( 'New' ).body;
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

function topWords( text ) {
	var words, positions, wordCounts;

	// Make it so that Keyword can match keyword, KeyWord, KEYWORD etc through equalization.
	words = text.toLowerCase(  ).split( /\W+/ );
	positions = [];
	wordCounts = [];

	for ( var i = 0; i < words.length; i++ ) {
		var word = words[i].replace( /(\b(\w{1,4})\b(\s|$))/g,'' );
		if ( ! word ) {
			continue;
		}
		if ( typeof positions[word] == 'undefined' ) {
			positions[word] = wordCounts;
			wordCounts.push( [word] );
		} else {
			wordCounts[positions[word]]++;
		}
	}

	// Put most frequent words at the beginning.
	wordCounts.sort( function ( a, b ) {
		return b[1] - a[1];
	} );

	// Return the first n items
	return wordCounts;
}

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
						$counter.setCounter( $this, limit );
					} );
			}

			$counter.setCounter( $this, limit );
		},

		// Set the counter element for meta description and meta title
		setCounter : function( $target, limit ) {
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
	var $meta_title_height, $wp_screen_columns;

	// Meta Title's textarea's height to set
	$meta_title_height = jQuery( '#boldgrid-seo-field-meta_title' );
	// Screen Column's partial selector.
	$wp_screen_columns = '#adv-settings > div.columns-prefs > .columns-prefs-';

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
