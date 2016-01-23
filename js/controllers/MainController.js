define(['app'], function (app) {
	app.controller('MainController', ['$scope', '$http', function($scope, $http) {




// node_example.js - Example showing use of Clarifai node.js API

//var Clarifai = require('./clarifai_node.js');
Clarifai.initAPI('9TGmL-WCID4FTGtpMakHtZ2tbdGWk8hTkMcE8ryq', 'k8pRI9tMmy32miSCcg8k03ejioGH-ugdb4icPGcm');



// support some command-line options

//var verbose = opts["verbose"];
//Clarifai.setVerbose( verbose );
//if( opts["print-http"] ) {
//	Clarifai.setLogHttp( true ) ;
//}

//if(verbose) console.log("using CLIENT_ID="+Clarifai._clientId+", CLIENT_SECRET="+Clarifai._clientSecret);

// Setting a throttle handler lets you know when the service is unavailable because of throttling. It will let
// you know when the service is available again. Note that setting the throttle handler causes a timeout handler to
// be set that will prevent your process from existing normally until the timeout expires. If you want to exit fast
// on being throttled, don't set a handler and look for error results instead.

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});

function commonResultHandler( err, res ) {
	if( err != null ) {
		if( typeof err["status_code"] === "string" && err["status_code"] === "TIMEOUT") {
			console.log("TAG request timed out");
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ALL_ERROR") {
			console.log("TAG request received ALL_ERROR. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "TOKEN_FAILURE") {
			console.log("TAG request received TOKEN_FAILURE. Contact Clarifai support if it continues.");				
		}
		else if( typeof err["status_code"] === "string" && err["status_code"] === "ERROR_THROTTLED") {
			console.log("Clarifai host is throttling this application.");				
		}
		else {
			console.log("TAG request encountered an unexpected error: ");
			console.log(err);				
		}
	}
	else {
		//if( opts["print-results"] ) {
			// if some images were successfully tagged and some encountered errors,
			// the status_code PARTIAL_ERROR is returned. In this case, we inspect the
			// status_code entry in each element of res["results"] to evaluate the individual
			// successes and errors. if res["status_code"] === "OK" then all images were 
			// successfully tagged.
			if( typeof res["status_code"] === "string" && 
				( res["status_code"] === "OK" || res["status_code"] === "PARTIAL_ERROR" )) {

				// the request completed successfully
				
					if( res["results"][0]["status_code"] === "OK" ) {
						$scope.generateHaiku(res["results"][0].result["tag"]["classes"] )
					}
					else {
						console.log( 'docid='+res.results[i].docid +
							' local_id='+res.results[i].local_id + 
							' status_code='+res.results[i].status_code +
							' error = '+res.results[i]["result"]["error"] )
					}
				

			}
		//}			
	}
}






		$scope.haiku = [[],[],[]];
		$scope.imageTags = ['temp','word','list','hamburger','pizza','octopus'];
		$scope.image = {
			url: 'http://www.clarifai.com/img/metro-north.jpg'
		}
		//TEMP
		// do something when the button is clicked
		$scope.buttonClick = function() {
			//$scope.generateHaiku($scope.imageTags);
			Clarifai.tagURL( $scope.image.url , "haiku", commonResultHandler );
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










Clarifai.clearThrottleHandler();






	}]);
});