/*
	Generate.js
	------------
	Generate an array of notes to accomodate one or more bars
*/
var _ = require('lodash');
//var patterns = require('./patterns');

var Generate = {

	/*
		Cycle through an array of notes and return required bar of notes of required noteLength.

		Parameters (Object):
		-------------------
		@notesArr: An array of notes to be used as a palette
		@noteLength: Specify beat count. Default: 32 (required for a 16 beat bar).
		@bars: Specify number of bars required. Default: 1.
		@randomize: Use random notes from notesArr if set to true. Default: false.
		@pattern: Specify a pattern to create the bar from. Default: 'x-xxx-xx-x-'

	*/
	bars: function(obj) {

		obj.notesArr = obj.notesArr || ['c3'];
		obj.noteLength = obj.noteLength || 32;
		obj.bars = obj.bars || 1;
		obj.randomize = obj.randomize || false;
		obj.pattern = obj.pattern || 'x_x_x___x___x___';	//set a nice default pattern

		var requiredNumberOfNoteObjects = 512/obj.noteLength * obj.bars;

		//make sure pattern is longer than the required noteLength * bars
		while(obj.pattern.length < requiredNumberOfNoteObjects) {
			obj.pattern += obj.pattern;
		}

		//make sure notesarr is longer than the required noteLength * bars
		while(obj.notesArr.length < requiredNumberOfNoteObjects) {
			obj.notesArr = obj.notesArr.concat(obj.notesArr);
		}

		var returnArr = [];

		for (var i = 0; i < obj.pattern.length; i++) {
			var note = obj.notesArr[i];
			if(obj.randomize) note = obj.notesArr[_.random(obj.notesArr.length - 1)];

			//create a note object to add to the return array
			var noteObj = { noteLength: 32 };
			if(obj.pattern[i] == 'x') {
				//note on
				noteObj.note = note;
				//check if the next step(s) is a sustain (denoted by an underscore)
				
				for (var sustainCount = i+1; sustainCount < obj.pattern.length; sustainCount++ ) {
					if (obj.pattern[sustainCount] == '_') {
						noteObj.noteLength += obj.noteLength;
					} else {
						break;
					}
				}

				//push this note object to the return array
				returnArr.push(noteObj);
			}
			else if(obj.pattern[i] == '-') {
				noteObj.note = '';
				returnArr.push(noteObj);
			}

			

		}
		
		return returnArr;
	}

};

module.exports = Generate;