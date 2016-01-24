app.controller('MainController', ['$scope', '$http', function($scope, $http) {

	$scope.haiku = [[],[],[]];
	//$scope.imageTags = ['temp','word','list','hamburger','pizza','octopus'];
	$scope.image = {
		url: 'http://www.clarifai.com/img/metro-north.jpg'
	}
	//TEMP
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
					/*
					var name = 'tagOverlay' + incr;
					incr++;
					var hamlAlt = "<div class='clari_overlay' id='"+ name + "'>";
					$.each(tags, function(curr2, tag) {
						htmlAlt += "<div class='clari_tag'>" + tag + "</div>";
					});
					htmlAlt += "</div>";

					$(that).after(htmlAlt);
					var destination = $(that).offset();
					$('#'+name).width($(that).width);
					$('#'+name).css({top: destination.top, left: destination.left});
					*/
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
		tagList = [];

		// contains each of the three lines of the haiku
		haiku = [[],[],[]];
		
		// loop through all words and find syllables and parts of speech
		for (i=0; i<wordList.length; i++) {
			syllableList.push($scope.syllables(wordList[i]));
			tagList.push($scope.tag(wordList[i]));
		}

		//TEMP just return something dumb for now, make it legit later
		for (line=0; line<3; line++) {
			syl = 0; //current syllable count
			max_syl = 5 + (line%2)*2; // 5 / 7 / 5
			while(syl < max_syl) {
				index = Math.floor(Math.random()*wordList.length);
				while(syllableList[index] + syl > max_syl) {
					index = Math.floor(Math.random()*wordList.length);
				}
				haiku[line].push(wordList[index]);
				haiku[line].push(syllableList[index]);
				syl += syllableList[index];
			}
		}
		$scope.haiku = haiku;
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
	$scope.tag = function (word) {
		//this could either be a dictionary lookup, 
		//or use some part-of-speech tagging software,
		//or just assume they are all nouns
		return 'noun'; //TEMP
	}

}]);