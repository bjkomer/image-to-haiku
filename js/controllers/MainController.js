app.controller('MainController', ['$scope', '$http', function($scope, $http) {

	$scope.haiku = [[],[],[]];
	//$scope.imageTags = ['temp','word','list','hamburger','pizza','octopus'];
	$scope.image = {
		url: 'http://www.clarifai.com/img/metro-north.jpg'
	}
	
	// do something when the button is clicked
	$scope.buttonClick = function() {
		//$scope.generateHaiku($scope.imageTags);
		//Clarifai.tagURL( $scope.image.url , "haiku", commonResultHandler );
		var authToken = 'RJS4dizHZwmadpm55Jq5GW7BFmHgOw';
		var dataJson = {'url' : $scope.image.url};
		$.ajax({
			url: 'https://api.clarifai.com/v1/tag/',
			type: 'POST',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Authorization', 'bearer ' + authToken);
			},

			data: dataJson,
			dataType: 'json',

			success: function (object) {
				$.each(object.results, function(curr, results) {
					var tags = results.result.tag.classes;
					$scope.generateHaiku(tags);
				});
				console.log("success!");
				return;
			},
			error:function(err) {
				console.log("fail: ajax");
				return;
			},
		});
	}

	// Generates a Haiku based on the list of words provided
	$scope.generateHaiku = function (wordList) {
		syllableList = [];
		posTagList = [];
		words = [];
		// possible syllable numbers of the words
		possibleSyllables = {
			noun: [false, false, false, false],
			verb: [false, false, false, false],
			adjective: [false, false, false, false],
			adverb: [false, false, false, false]
		}

		// contains each of the three lines of the haiku
		haiku = [[],[],[]];
		
		// loop through all words and find syllables and parts of speech
		for (i=0; i<wordList.length; i++) {
			if (wordList[i] != 'no person') { //a dumb way to remove this, but it works
				syllables = $scope.syllables(wordList[i]);
				posTag = $scope.posTag(wordList[i])

				if (syllables < 5) {
					possibleSyllables[posTag][syllables] = true;
				}

				syllableList.push(syllables);
				posTagList.push(posTag);
				words.push(wordList[i]);
			}
		}

		//TEMP just return something dumb for now, make it legit later
		for (line=0; line<3; line++) {
			syl = 0; //current syllable count
			max_syl = 5 + (line%2)*2; // 5 / 7 / 5
			/*
			structureMap = $scope.getStructureMap(max_syl, possibleSyllables)
			while(syl < max_syl) {
				index = Math.floor(Math.random()*words.length);
				while(syllableList[index] + syl > max_syl) {
					index = Math.floor(Math.random()*words.length);
				}
				haiku[line].push(words[index]);
				haiku[line].push(syllableList[index]);
				syl += syllableList[index];
			}
			*/
			//console.log(max_syl);
			haiku[line].push($scope.S(max_syl)); //TEMP
		}
		$scope.haiku = haiku;
	}

	$scope.getStructureMap = function(max_syl, possibleSyllables) {
		var syl_left = max_syl;
		var structureMap = []

		return $scope.S(max_syl)

	}
	$scope.S = function(syl_left) {
		ret = ""
		if (Math.random()*syl_left > 4) {
			// NP + VP case
			x = Math.floor(Math.random()*(syl_left-2)+1);

			if (x > 1) {
				y =  Math.floor(Math.random()*(x-2)+1);
				ret += adjective(y) + " " + noun(x-y);
			} else {
				ret += noun(x);
			}

			if (syl_left-x > 1) {
				z =  Math.floor(Math.random()*(syl_left-x-2)+1);
				ret += verb(syl_left-x-z) + " " + adverb(z);
			} else {
				ret += verb(syl_left-x);
			}
			return ret;
		} else {
			// NP case
			x = Math.floor(Math.random()*(syl_left-2)+1);

			if (x > 1) {
				y =  Math.floor(Math.random()*(x-2)+1);
				ret += adjective(y) + " " + noun(x-y);
			} else {
				ret += noun(x);
			}
			return ret;
		}
	}
	/*
	$scope.S = function(syl_left) {
		if (Math.random()*syl_left > 4) {
			// NP + VP case
			x = Math.floor(Math.random()*(syl_left-2)+1);
			return NP(x).concat(" ", VP(syl_left - x));
		} else {
			// NP case
			return NP(syl_left);
		}
	}

	// (Adj) N
	var NP = function NPr (syl_left) {
		if (syl_left == 1) {
			return noun(1);
		} else {
			x = Math.floor(Math.min(Math.random()*syl_left*3,4));
			if (x == 0 || x >= syl_left) {
				if (syl_left == 0) {
					console.log("NP-syl_left-0");
					console.log(syl_left);
				}
				return noun(syl_left)
			} else {
				if (x == 0) {
					console.log("NP-x");
					console.log(x);
				} else if (syl_left == 0) {
					console.log("NP-syl_left");
					console.log(syl_left);
				}
				//console.log("NP");
				//console.log(x);
				//console.log(syl_left - x);
				//console.log("");
				//return AdjP(x).concat(" ", NPr(syl_left - x));
				return AdjP(x).concat(" ", noun(syl_left - x));
			}
		}
	}

	// VP -> V (NP) (PP) (Adv)
	VP = function(syl_left) {
		if (syl_left == 1) {
			return verb(1);
		} else {
			x = Math.floor(Math.min(Math.random()*syl_left,4));
			if (x == 0 || x >= syl_left) {
				return verb(Math.floor(syl_left))
			} else {
				if (x==1) {
					return verb(Math.floor(syl_left - x)).concat(" ", adverb(x));
				} else {
					y = Math.floor(Math.random()*(x-2)+1)
					//return verb(syl_left - x).concat(" ", NP(y)," ", adverb(x-y));
					return verb(Math.floor(syl_left - x)).concat(" ", noun(y)," ", adverb(Math.floor(x-y)));
				}
			}
		}
	}
	// AdjP -> (AdjP) Adj
	var AdjP = function AdjPr (syl_left) {
		if (syl_left == 1) {
			return adjective(1);
		} else {
			x = Math.floor(Math.min(Math.random()*syl_left*2,4));
			if (x == 0 || x >= syl_left) {
				if (syl_left == 0) {
					console.log("AdjP-syl_left-0");
					console.log(syl_left);
				}
				return adjective(syl_left)
			} else {
				if (x == 0) {
					console.log("AdjP-x");
					console.log(x);
				} else if (syl_left == 0) {
					console.log("AdjP-syl_left");
					console.log(syl_left);
				}
				//console.log("AdjP");
				//console.log(x);
				//console.log(syl_left - x);
				//console.log("");
				//return AdjPr(x).concat(" ", adjective(syl_left - x));
				return adjective(x).concat(" ", adjective(Math.floor(syl_left - x)));
			}
		}
	}
	*/
	var noun = function(syl_left) {
		return "noun"+syl_left.toString(); //temp
	}

	var verb = function(syl_left) {
		return "verb"+syl_left.toString(); //temp
	}

	var adjective = function(syl_left) {
		return "adjective"+syl_left.toString(); //temp
	}

	var adverb = function(syl_left) {
		return "adverb"+syl_left.toString(); //temp
	}


	// Returns the number of syllables in a given word
	$scope.syllables = function (word) {
		//this could either be a dictionary lookup, 
		//or use the hyphenation software and split on hyphens: http://alias-i.com/lingpipe/demos/tutorial/hyphenation/read-me.html
		//return 1; //TEMP
		//return nlp_compromise.term(word).syllables().length;
		word = word.toLowerCase();                                     //word.downcase!
		if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
		word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
		word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
		return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
	}

	// Returns the part-of-speech tag for a given word
	$scope.posTag = function (word) {
		//this could either be a dictionary lookup, 
		//or use some part-of-speech tagging software,
		//or just assume they are all nouns
		return 'noun'; //TEMP
	}

}]);