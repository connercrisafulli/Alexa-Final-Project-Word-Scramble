//************************************************************************************************************************************
//Conner Crisafulli
//Alexa-Final-Project-Skill-Word-Scramble
//Teacher-Mrs. Sellers
//12 June 2018
//************************************************************************************************************************************

//************************************************************************************************************************************
//Conner Crisafulli
//Alexa-Final-Project-Skill-Word-Scramble
//Teacher-Mrs. Sellers
//12 June 2018
//************************************************************************************************************************************

'use strict';
const Alexa = require('alexa-sdk');

//variables for handler methods. 
const APP_ID = undefined;
const SKILL_NAME = 'Word Scrambler';
const GET_FACT_MESSAGE = "Here's your word scramble: ";
const HELP_MESSAGE = 'You can say yes to move on, or ask for a hint, or say stop to quit and let me serenade you!';
const HELP_REPROMPT = 'Your not smart?';
//funny response to stop message
const STOP_MESSAGE = 'I am sorry to see you leave so soon! I bid you farewell! I just have to say   ' +
'Baby come back, listen baby, you can blame it all on me, I was wrong, and I just cant live without you, I was wrong, and I just cant live';

//Global variables used to throught code for the word scramble!
var scramble = ['snake', 'pie', 'jungle', 'ice', 'hello', 'soup', 'codiva', "ham", 'hard', 'mars', 'complicated', 'supercalifragilisticexpialidocious', 'conner', 'rear', 'astonishing', 'link', 'correspondence', 'disappointment'];
var wordDone = []; 
var userScore = 0;
var compScore = 0;
var index = 0;
var hintLeft = 1;

//Handelers to catch errors in Alexa and handel certain types of responses
var handlers = {
  'LaunchRequest': function () {
      this.emit(':tell',  'No intent by that name'); 
  },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;

        this.response.speak(speechOutput).listen();
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    
//This function acts as the introIntent and asks the user if they are ready to play and describes the game incase the user 
//is unaware how to play.
 'Play': function () {
    //resets variables for replayability.
    userScore = 0;
    compScore = 0;
    index = 0;
    wordDone = [];
    //sets up the response for explaining how to play!
    this.response.speak("Ok lets play the game, you have to get three words correct, " +
    "if you get three words wrong I win, if you get them right I lose! Are you ready for word one?")
    .listen(STOP_MESSAGE);
    this.emit(':responseReady');
    },
 'wordOne': function() {
    //sets up local variables and scrambleWordIndex uses the random JS class in Math. This ensures that a random word 
    //is chosen by the comp each time.
    var wordOne = '';
    var scrambleWordIndex = scramble[Math.floor(Math.random() * scramble.length)];
    //this pushes the array wordDone over one and adds to it like the arraylist class in Java.
    wordDone.push(scrambleWordIndex);
    //this sends the scrambleWordIndex var into the scramble method which will return a array of scrambled letters from 
    //the word.
    wordOne = ScrambleWord(scrambleWordIndex);
    //This section of 'wordOne' tells the user what the scramble letters are so they can guess them
    this.response.speak('your scramble letters are ' + wordOne)
    .listen(STOP_MESSAGE);
    this.emit(':responseReady');
 },
 'wordOneAnswer' : function() {
     //This lets the var quest = to the users answer and then sends it into the checkUserAnswer method to see if it was
     //right or wrong.
     let quest = checkUserAnswer(this.event.request.intent.slots.wordOneAnswerSlot.value);
     //checks to see what the score is and if the game is over tells the user acceptably and gives them 
     //the option to play again.
     if (checkScore() == 1){
         this.response.speak("Congratulations, you won! Please challenge me again soon! The final score was Alexa " + compScore +
         ', to your score of ' + userScore + ', say lets play again to play again, otherwise say stop!').listen(STOP_MESSAGE);
         index++;
     }
     else if(checkScore() == 2){
         this.response.speak("Better luck next time! That last word was " + wordDone[index] + "Please challenge me again soon! The final score was Alexa " + compScore +
         ', to your score of ' + userScore + ', say lets play again to play again, otherwise say stop!').listen(STOP_MESSAGE);
         index++;
     }
     else if(checkScore() == 0){
        this.response.speak('the word was ' + wordDone[index] + ', that was ' + quest + ', the score is now Alexa ' + compScore + ' to your score of ' + userScore + 
        ', ready to continue?').listen(STOP_MESSAGE);
        index++;
     }
     //says one of the built responses to the user!
     this.emit(':responseReady');
  },
  
  //this function can be invoked by the user and gives them one hint (the word) at wordDone[index]. Then the user will guess the word
  //and hints left will because decrease they only get one.
  'hints': function(){
      this.response.speak('you have ' + (hintLeft - 1) + ' hints left, the word is, ' + wordDone[index]).listen(STOP_MESSAGE);
      hintLeft--;
      this.emit(':responseReady');
  }
};

//this function is sent a word(string) from the wordOne intent (scrambleWordIndex variable) this will take the word
//and split up the letters into an array of strings holding single letters
//if the word sent in was "example" it would call the random class and send in ["E","x","a","m","p","l","e"]
function ScrambleWord(word) {
  var wordString = [];
  var ans = [];
  for(let i = 0; i < word.length; i++)
  {
    wordString.push(word.charAt(i));
  }
  ans = Randomize(wordString);
  return ans;
}

//this takes in the aforemntioned array of strings and randomizes where each letter will sit in the array
//so the example would become {"m","E","a","e","x","l","p"]. This returns the previous array into the 
//wordOne to spit out to the user.
function Randomize(word){
    var randomNum;
    var letter = '';
    for(var i = 0; i < 20; i++){
        randomNum = Math.floor(Math.random() * word.length);
        letter = word[0];
        word[0] = word[randomNum];
        word[randomNum] = letter;
    }
    return word;
}

//this method takes in the answer that was declared in the answers slot and compares it to the string stored in 
//the wordDone array which held a string that was the word scrambled for the user. and returns a string 
//'correct' or 'incorrect' to tell the user.
function checkUserAnswer(answer){
    let quest = 'error with quest var';
    let hold = wordDone[index];
    if(answer == hold) {
         userScore ++;
         quest = 'correct ';
    }
    else if(answer != hold) {
         compScore ++;
        quest = 'incorrect ';
    }
    return quest;
}

//this function checks the score to tell alexa what to respond
function checkScore(){
    if(userScore >= 3)
        return 1;
    else if(compScore >=3 )
        return 2;
    return 0;
}

//this handeler is required to communicate with alexa.
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
