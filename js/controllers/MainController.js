app.controller('MainController', ['$scope', '$http', function($scope, $http) {

	$scope.haiku = [[],[],[]];
	//$scope.imageTags = ['temp','word','list','hamburger','pizza','octopus'];
	$scope.image = {
		url: 'http://www.clarifai.com/img/metro-north.jpg'
	}

	$scope.randomWords = {
		'noun':{
			1:['dog'],
			2:['dresser'],
			3:['catapult'],
			4:['experiment']
		},
		'verb':{
			1:['throw'],
			2:['compare'],
			3:['multiply'],
			4:['congratulate']
		},
		'adjective':{
			1:['clean'],
			2:['pretty'],
			3:['similar'],
			4:['necessary']
		},
		'adverb':{
			1:['fresh'],
			2:['ago'],
			3:['together'],
			4:['especially']
		}
	}
	
	$http.get('data/words.json')
		.success(function(data) {
			$scope.randomWords = data;
		})
		.error(function(data) {
			$scope.randomWords = null;
	});
	
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

		tagWords = {
			'noun':[],
			'verb':[],
			'adjective':[],
			'adverb':[]
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
				} else {
					posTag = 'noun';
				}

				tagWords[posTag].push([wordList[i], syllables])

				//syllableList.push(syllables);
				//posTagList.push(posTag);
				//words.push(wordList[i]);
			}
		}

		map = ['noun', 'verb', 'adjective', 'adverb']

		for (i=0;i<30;i++){
			for (j=0;j<4;j++) {
				//syl = Math.floor(5-Math.sqrt(Math.random()*16+1)); //weigh a bit heaving on lower syllables
				syl = Math.floor(Math.random()*4+1);
				tagWords[map[j]].push([$scope.getRandomWord(map[j], syl), syl]);
			}
		}
		nounIndex = 0;
		verbIndex = 0;
		adjectiveIndex = 0;
		adverbIndex = 0;

		syllables_left = [5,7,5];
		for (i=0;i<Math.min(tagWords['verb'].length,3);i++) {
			haiku[i].push(tagWords['verb'][i][0]);
			syllables_left[i] -= tagWords['verb'][i][1];
		}

		for (i=0;i<Math.min(tagWords['noun'].length,3);i++) {
			if (syllables_left[i] >= tagWords['noun'][i][1]) {
				haiku[i].unshift(tagWords['noun'][i][0]);
				syllables_left[i] -= tagWords['noun'][i][1];
				if (syllables_left[i] == 0) {
					continue;
				}
			} else {
				var needRandom = true;
				for (j=3;j<tagWords['noun'].length;j++) {
					if (syllables_left[i] >= tagWords['noun'][j][1]) {
						haiku[i].unshift(tagWords['noun'][j][0]);
						syllables_left[i] -= tagWords['noun'][j][1];
						needRandom = false;
						break;
					}
				}
				if (needRandom) {
					// get random word of specific syllables
					haiku[i].unshift($scope.getRandomWord('noun',Math.min(syllables_left[i],4)));
				}
			}
		}

		for (i=0;i<Math.min(tagWords['adjective'].length,3);i++) {
			if (syllables_left[i] == 0) {
				continue;
			}
			if (syllables_left[i] >= tagWords['adjective'][i][1]) {
				haiku[i].unshift(tagWords['adjective'][i][0]);
				syllables_left[i] -= tagWords['adjective'][i][1];
				if (syllables_left[i] == 0) {
					continue;
				}
			} else {
				var needRandom = true;
				for (j=3;j<tagWords['adjective'].length;j++) {
					if (syllables_left[i] >= tagWords['adjective'][j][1]) {
						haiku[i].unshift(tagWords['adjective'][j][0]);
						syllables_left[i] -= tagWords['adjective'][j][1];
						needRandom = false;
						break;
					}
				}
				if (needRandom) {
					// get random word of specific syllables
					haiku[i].unshift($scope.getRandomWord('adjective',Math.min(syllables_left[i],4)));
				}
			}
		}


		for (i=0;i<Math.min(tagWords['adverb'].length,3);i++) {
			if (syllables_left[i] == 0) {
				continue;
			}
			if (syllables_left[i] >= tagWords['adverb'][i][1]) {
				haiku[i].push(tagWords['adverb'][i][0]);
				syllables_left[i] -= tagWords['adverb'][i][1];
				if (syllables_left[i] == 0) {
					continue;
				}
			} else {
				var needRandom = true;
				for (j=3;j<tagWords['adverb'].length;j++) {
					if (syllables_left[i] >= tagWords['adverb'][j][1]) {
						haiku[i].push(tagWords['adverb'][j][0]);
						syllables_left[i] -= tagWords['adverb'][j][1];
						needRandom = false;
						break;
					}
				}
				if (needRandom) {
					// get random word of specific syllables
					
					haiku[i].push($scope.getRandomWord('adverb',Math.min(syllables_left[i],4)));
				}
			}
		}


		/*
		//TEMP just return something dumb for now, make it legit later
		for (line=0; line<3; line++) {
			syl = 0; //current syllable count
			max_syl = 5 + (line%2)*2; // 5 / 7 / 5
			
			//structureMap = $scope.getStructureMap(max_syl, possibleSyllables)
			while(syl < max_syl) {
				index = Math.floor(Math.random()*words.length);
				while(syllableList[index] + syl > max_syl) {
					index = Math.floor(Math.random()*words.length);
				}
				haiku[line].push(words[index]);
				haiku[line].push(syllableList[index]);
				syl += syllableList[index];
			}
			
			//console.log(max_syl);
			haiku[line].push($scope.S(max_syl)); //TEMP
		}
		*/
		$scope.haiku = haiku;
		//document.getElementById('haiku').innerHTML = haiku[0].join(" ")+"\n"+haiku[1].join(" ")+"\n"+haiku[2].join(" ");
		document.getElementById('haiku1').innerHTML = haiku[0].join(" ");
		document.getElementById('haiku2').innerHTML = haiku[1].join(" ");
		document.getElementById('haiku3').innerHTML = haiku[2].join(" ");
		playAudio(haiku);
		//playAudio(haiku[0]);
		//playAudio(haiku[1]);
		//playAudio(haiku[2]);
	}

	$scope.getRandomWord = function(pos, syl) {
		wordList = $scope.randomWords[pos][syl];
		return wordList[Math.floor(Math.random()*wordList.length)];
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


	// START - YOU WILL NEED TO OVERWRITE THESE VALUES
// Nina WebSocket Server
var host = "nim-rd.nuance.mobi";
var port = 8885;
var path = "nina-websocket-api/nina";

// For the NinaStartSession CONNECT message
var nmaid = "ConUHackCo020_ConUHackApp020_20160112_213505"//"conuhack020@cmardini.33mail.com";
var nmaidKey = "71c3d8501e0b6ce032cdeb2f0ce2c12b94e70737d531368a562d2f4925b02532e6ee40b27177a6564b848bcf87cf552db2f8274e821c473f5bdfbf4bddbebfdc"//"o5YBz9w3";

// For the NinaStartSession COMMAND message
var appName = "ConUHackApp023zzz";
var companyName = "ConUHackCo023";
var appVersion = "0.0";
// END - YOU WILL NEED TO OVERWRITE THESE VALUES



// Messages templates
var message_connect = {connect: {nmaid: nmaid, nmaidKey: nmaidKey}};
var message_start = {command: {name: "NinaStartSession", appName: appName, companyName: companyName, appVersion: appVersion}};
var message_end = {command: {name: "NinaEndSession"}};

// Audio handlers
var audioContext = initAudioContext();
var audioPlayer = new AudioPlayer(audioContext); // For the play audio command


// The WebSocket
$scope.socket;



$scope.initWebSocket = function() {

    $scope.socket = new WebSocket("wss://" + host + ":" + port + "/" + path); // The WebSocket must be secure "wss://"
    $scope.socket.binaryType = "arraybuffer"; // Important for receiving audio



    $scope.socket.onopen = function () {
        console.log("WebSocket connection opened.");

        $scope.socket.send(JSON.stringify(message_connect));
        $scope.socket.send(JSON.stringify(message_start));
    };
    
    $scope.socket.onclose = function () {
        console.log("WebSocket connection closed.");
    };

    $scope.socket.onmessage = function (event) {

        if (isOfType("ArrayBuffer", event.data)) { // The play audio command will return ArrayBuffer data to be played
            audioPlayer.play(event.data);

        } else { // event.data should be text and you can parse it
            var response = JSON.parse(event.data);

            if (response.QueryResult) {

                if (response.QueryResult.result_type === "NinaStartSession") {
                    //ui_sessionHasStarted();

                //} else if (response.QueryResult.result_type === "NinaEndSession") {
                    //ui_sessionHasEnded();

                    //$scope.socket.close();
                    //$scope.socket = undefined;

                //} else if (response.QueryResult.result_type === "NinaDoNLU") {
                    //ui_displayNLUresults(response.QueryResult.nlu_results);
                    
                } else if (response.QueryResult.result_type === "NinaDoSpeechReco") {
                    $('#speechreco_results').text(JSON.stringify(response));
                }
                
            } else if (response.QueryRetry) {
                $('#speechreco_results').text(JSON.stringify(response));
            }
        }
    };
}

$scope.startSession = function() {
    //ui_startSession();

    if ($scope.socket === undefined) {
        $scope.initWebSocket();
    }
}

$scope.endSession = function() {
    //ui_endSession();
    console.log("end session was called");
    $scope.socket.send(JSON.stringify(message_end));
}

function nlu() {
    var inputText = fixLineBreaks($("#nlu_text").val());



        //ui_clearNLUresults();

        $scope.socket.send(JSON.stringify({
            command: {
                name: "NinaDoNLU",
                text: inputText
            }
        }));

}

function playAudio(haiku) {
    //var inputText = haiku[0]+'\x1B'+haiku[1]+'\x1B'+haiku[2];//fixLineBreaks($("#playaudio_text").val());
	var inputText = haiku[0]+". "+haiku[1]+". "+haiku[2];
	//var inputText = haiku;

        $scope.socket.send(JSON.stringify({
            command: {
                name: "NinaPlayAudio",
                text: inputText
            }
        }));
}




var audioRecorder;
var shouldStopRecording = true;


function stopRecording() {
    //ui_stopRecording();
    
    shouldStopRecording = true;    
    
    audioRecorder.stop();
    audioRecorder = undefined;
    
    $scope.socket.send(JSON.stringify({
        endcommand: {}
    }));
}

function startRecording() {
    //ui_startRecording();
    
    $scope.socket.send(JSON.stringify({
        command: {
            name: "NinaDoSpeechReco"
        }
    }));
    
    shouldStopRecording = false;  
    console.log("Recorder started.");

    // IMPORTANT Make sure you create a new AudioRecorder before you start recording to avoid any bugs !!!
    audioRecorder = new AudioRecorder(audioContext);
    
    audioRecorder.start().then(
            
            // This callback is called when "def.resolve" is called in the AudioRecorder.
            // def.resolve
            function () {
                console.log("Recorder stopped.");
            },
            
            // def.reject
            function () {
                console.log("Recording failed!!!");
            },
            
            // def.notify
            function (data) { // When the recorder receives audio data
                console.log("Audio data received...");
                
                if (shouldStopRecording) {
                    return;
                }

                // tuple: [encodedSpx, ampArray]
                //   resampled audio as Int16Array 
                //   amplitude data as Uint8Array
                var frames = data[0]; // Int16Array

                $scope.socket.send(frames.buffer);
            }
    );
}

$scope.startSession();


}]);