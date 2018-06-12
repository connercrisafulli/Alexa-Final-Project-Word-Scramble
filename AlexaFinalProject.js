/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = undefined;

const SKILL_NAME = 'Space Facts';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me a space fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

var scramble = ['snake', 'pie', 'jungle', 'ice', 'hello', 'soup', 'codiva', "ham", 'hard', 'mars', 'complicated', 'supercalifragilisticexpialidocious', 'conner', 'rear', 'astonishing', 'link', 'correspondence', 'disappointment'];

var wordDone = []; 
var userScore = 0;
var compScore = 0;
var index = 0;
//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

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
    
    
 'Play': function () {
    userScore = 0;
    compScore = 0;
    index = 0;
    wordDone = [];
    this.response.speak("Ok lets play the game you have to get three words correct, " +
    "if you get three wrong I win, if you do get them I lose! Are you ready for word one?")
    .listen("you are taking to long to respond!");
    this.emit(':responseReady');
    },
 'wordOne': function() {
    var wordOne = '';
    var scrambleWordIndex = scramble[Math.floor(Math.random() * scramble.length)];
    wordDone.push(scrambleWordIndex);
    wordOne = ScrambleWord(scrambleWordIndex);
    this.response.speak('your scramble letters are ' + wordOne)
    .listen("sorry you have timed out thanks for playing");
    this.emit(':responseReady');
 },
 'wordOneAnswer' : function() {
     let quest = checkUserAnswer(this.event.request.intent.slots.wordOneAnswerSlot.value);
     if (checkScore() == 1){
         this.response.speak("Congratulations, you won! Please challenge me again soon! The final score was Alexa " + compScore +
         ' to your score of ' + userScore + '!').listen("sorry you have timed out thanks for playing");
         index++;
     }
     else if(checkScore() == 2){
         this.response.speak("Better luck next time! Please challenge me again soon! The final score was Alexa " + compScore +
         ' to your score of ' + userScore + '!').listen("sorry you have timed out thanks for playing");
         index++;
     }
     else if(checkScore() == 0){
        this.response.speak('the word was ' + wordDone[index] +' that was ' + quest + 'the score is now Alexa ' + compScore + ' to your score of ' + userScore + 
        ' ready to continue?').listen("sorry you have timed out thanks for playing");
        index++;
     }
     this.emit(':responseReady');
  },
};

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

function checkScore(){
    if(userScore >= 3)
        return 1;
    else if(compScore >=3 )
        return 2;
    return 0;
}


exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
