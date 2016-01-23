app.controller('MainController', ['$scope', '$http', function($scope, $http) {

	$scope.haiku = [[],[],[]];
	$scope.image = {
		url: 'http://www.clarifai.com/img/metro-north.jpg'
	}
	//TEMP
	// do something when the button is clicked
	$scope.buttonClick = function() {
		$scope.generateHaiku(['temp','word','list']);
	}

	// Generates a Haiku based on the list of words provided
	$scope.generateHaiku = function (wordList) {
		syllableList = [];
		tagList = [];

		// contains each of the three lines of the haiku
		haiku = [[],[],[]];
		
		// loop through all words and find syllables and parts of speech
		for (i=0; i<wordList.length; i++) {
			syllableList.push($scope.syllables(wordList[i]));
			tagList.push($scope.tag(wordList[i]));
		}

		//TEMP just return something dumb for now, make it legit later
		for (i=0; i<3; i++) {
			syl = 0; //current syllable count
			while(syl < 5 + (i%2)*2) {
				index = Math.floor(Math.random()*wordList.length);
				haiku[i].push(wordList[index]);
				syl += 1;
			}
		}
		$scope.haiku = haiku;
	}

	// Returns the number of syllables in a given word
	$scope.syllables = function (word) {
		//this could either be a dictionary lookup, 
		//or use the hyphenation software and split on hyphens: http://alias-i.com/lingpipe/demos/tutorial/hyphenation/read-me.html
		return 1; //TEMP
	}

	// Returns the part-of-speech tag for a given word
	$scope.tag = function (word) {
		//this could either be a dictionary lookup, 
		//or use some part-of-speech tagging software,
		//or just assume they are all nouns
		return 'noun'; //TEMP
	}


}]);
