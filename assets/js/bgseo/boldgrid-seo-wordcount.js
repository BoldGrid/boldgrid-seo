( function( $, counter ) {

	$( function() {

		var $content = $( '#content' ),
			$count = $( '#wp-word-count' ).find( '.word-count' ),
			prevCount = 0,
			contentEditor,
			words;

		function update() {
			var text, count;

			if ( ! contentEditor || contentEditor.isHidden() ) {
				text = $content.val();
			} else {
				text = contentEditor.getContent( { format: 'raw' } );
			}

			count = counter.count( text );
			words = BOLDGRID.SEO.Words.words( text );

			if ( count !== prevCount ) {
				$content.trigger( 'bgseo-analysis', [{ words : words, count : count }] );
			}

			prevCount = count;
		}

		$( document ).on( 'tinymce-editor-init', function( event, editor ) {
			if ( editor.id !== 'content' ) {
				return;
			}

			contentEditor = editor;

			editor.on( 'nodechange keyup', _.debounce( update, 1000 ) );
		} );

		$content.on( 'input keyup', _.debounce( update, 1000 ) );

		update();

	} );

} )( jQuery, new wp.utils.WordCounter() );
