( function ( $ ) {

	describe( 'Counts occurrences of a substring in a string', function() {
		it( "Returns case sensitive matches of 2.", function() {
			var string = 'This is an example of testing how many times a word occurs in a string. Testing can be done using this testing string.',
			substring = 'testing';
			var occurs = string.occurences( substring );
			expect( occurs ).toBe( 2 );
		});
		it( "Should not find 2 matches if everything is normalized.", function() {
			var string = 'This is an example of testing how many times a word occurs in a string. Testing can be done using this testing string.',
			substring = 'testing';
			var occurs = string.toLowerCase().occurences( substring );
			expect( occurs ).not.toBe( 2 );
		});
		it( "Should return 3 matches if string is normalized.", function() {
			var string = 'This is an example of testing how many times a word occurs in a string. Testing can be done using this testing string.',
			substring = 'testing';
			var occurs = string.toLowerCase().occurences( substring );
			expect( occurs ).toBe( 3 );
		});
		it( "Checks that allowOverlapping if false by default.", function() {
			  var string = 'IIIIII',
			  substring = 'III';
			  var occurs = string.occurences( substring );
			  expect( occurs ).not.toBe( 4 );
		});
		it( "Finds two matches if allowOverlapping is false(default).", function() {
			var string = 'IIIIII',
			substring = 'III';
			var occurs = string.occurences( substring, false );
			expect( occurs ).toBe( 2 );
		});
		it( "Finds four matches if allowOverlapping is true.", function() {
			var string = 'IIIIII',
			substring = 'III';
			var occurs = string.occurences( substring, true );
			expect( occurs ).toBe( 4 );
		});
		it( "Empty string should return 0 occurences, and not be undefined.", function() {
			var string = '',
			substring = 'testing';
			var occurs = string.toLowerCase().occurences( substring );
			expect( occurs ).not.toBeUndefined();
			expect( occurs ).toBe( 0 );
		});
	});

	describe( 'Modify all of an object\'s property values.', function() {
		it( "Returns object with modified properties correctly.", function() {
			var modifyObject = _.modifyObject({ min: 0.5, max : 2.5 }, function( item ) {
				return item * item;
			});
			expect( modifyObject ).toEqual({ min: 0.25, max : 6.25 });
		});
		it( "Should be an object.", function() {
			var modifyObject = _.modifyObject({ min: 0.5, max : 2.5 }, function( item ) {
				return item * item;
			});
			expect( _.isObject( modifyObject ) ).toBeTruthy();
		});
		it( "Shouldn't have additional properties added.", function() {
			var modifyObject = _.modifyObject({ min: 0.5, max : 2.5 }, function( item ) {
				return item * item;
			});
			expect( _( modifyObject ).has( 'randomProperty' ) ).toBeFalsy();
		});
		it( "Should contain the same properties.", function() {
			var modifyObject = _.modifyObject({ min: 0.5, max : 2.5 }, function( item ) {
				return item * item;
			});
			expect( _( modifyObject ).has( 'min' ) && _( modifyObject ).has( 'max' ) ).toBeTruthy();
		});
		it( "Object's new properties should have modified values", function() {
			var obj = { min: 0.5, max : 2.5 };
			var modifyObject = _.modifyObject( obj, function( item ) {
				return item * item;
			});
			expect( obj.min !== _.property( modifyObject )( 'min' ) && obj.max !== _.property( modifyObject )( 'min' ) ).toBe( true );
		});

	});

	describe( 'Round a number to the nearest decimal specified.', function() {
		it( 'Rounds up to closest whole number.', function() {
			var number = 10.678;
			var round = ( number ).rounded( 0 );
			expect( round ).toBe( 11 );
		});
		it( 'Rounds down to closest whole number.', function() {
			var number = 10.378;
			var round = ( number ).rounded( 0 );
			expect( round ).toBe( 10 );
		});
		it( 'Rounds up to closest decimal place.', function() {
			var number = 4.346;
			var round = ( number ).rounded( 2 );
			expect( round ).toBe( 4.35 );
		});
		it( 'Rounds down to closest decimal place.', function() {
			var number = 98.99237182;
			var round = ( number ).rounded( 5 );
			expect( round ).toBe( 98.99237 );
		});
		it( 'Rounds to a whole number if no digits are specified.', function() {
			var number = 98.99237182;
			var round = ( number ).rounded();
			expect( round ).toBe( 99 );
		});
	});
	describe( 'Gets properties requested in a deeply nested object.', function() {
		it( "Should be an object.", function() {
			var pickDeep = _.pickDeep({ a : 'a', b : { c : 'c', d : 'd', e : 'e' } }, 'b.c','b.d' );
			expect( pickDeep ).not.toBeUndefined();
			expect( _.isObject( pickDeep ) ).toBeTruthy();
		});
		it( "Should be an unique object.", function() {
			var pickDeep = _.pickDeep({ a : 'a', b : { c : 'c', d : 'd', e : 'e' } }, 'b.c','b.d' );
			expect( pickDeep ).not.toBe({ b : { c : 'c', d : 'd' } });
		});
		it( "Should return a new object containing properties specified.", function() {
			var pickDeep = _.pickDeep({ a : 'a', b : { c : 'c', d : 'd', e : 'e' } }, 'b.c','b.d' );
			expect( pickDeep ).toEqual({ b : { c : 'c', d : 'd' } });
		});
		it( "Should return an empty object is no matches found.", function() {
			var pickDeep = _.pickDeep({ a : 'a', b : { c : 'c', d : 'd', e : 'e' } }, 'p.c','o.d' );
			expect( pickDeep ).not.toBeUndefined();
			expect( _.isEmpty( pickDeep ) ).toBeTruthy();
		});
	});

	describe( 'Get boolean response if number is within a range.', function() {
		it( "Should return true if number is within the range.", function() {
			var number = 12;
			var between = ( number ).isBetween( 9, 80 );
			expect( between ).toBeTruthy();
		});
		it( "Should return false if number is not within the range.", function() {
			var number = 12;
			var between = ( number ).isBetween( 9, 12 );
			expect( between ).toBeFalsy();
		});

		it( "Should correctly handle negative values.", function() {
			var number = -2;
			var between = ( number ).isBetween( 9, 12 );
			expect( between ).toBeFalsy();
		});

		it( "Should correctly handle decimals.", function() {
			var number = 2.982;
			var between = ( number ).isBetween( 2, 3 );
			expect( between ).toBeTruthy();
		});

		it( "Should handle 0 correctly", function() {
			var number = 0;
			var between = ( number ).isBetween( -5, 10 );
			expect( between ).toBeTruthy();
		});

		it( "Determines range despite input provided by using Math.max and Math.min", function() {
			var number = 1;
			var between = ( number ).isBetween( 10, -5 );
			expect( between ).toBeTruthy();
		});

		it( "Assigns 0 as a default if a param is not entered.", function() {
			var number = 1;
			var between = ( number ).isBetween( 10 );
			expect( between ).toBeTruthy();
		});

		it( "Assigns 0 for max and min if no params are entered (always false).", function() {
			var number = 1;
			var between = ( number ).isBetween();
			expect( between ).toBeFalsy();
		});
	});

	describe( 'Replaces %s occurences in string like printf.', function() {

		it( "Handles single replacement.", function() {
			var string = 'This is a string that %s be dynamic';
			var printf = ( string ).printf( 'can' );
			expect( printf ).toBe( 'This is a string that can be dynamic' );
		});

		it( "Handles multiple replacements.", function() {
			var string = 'This is a string that %s be dynamic%s';
			var printf = ( string ).printf( 'can', '!' );
			expect( printf ).toBe( 'This is a string that can be dynamic!' );
		});

		it( "Handles calling function without anything to replace.", function() {
			var string = 'This is a string that be dynamic';
			var printf = ( string ).printf( 'can', '!' );
			expect( printf ).toBe( 'This is a string that be dynamic' );
		});
	});

})( jQuery );
