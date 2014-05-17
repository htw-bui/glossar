requirejs.config({
  paths: {
    "jquery": [
      "https://code.jquery.com/jquery-2.1.0",
      // If the CDN fails, load from this local module instead
      "lib/jquery"
    ]
  }
});


define(['jquery', 'ProgressCounter', 'stopwatch', 'utils'], function($, ProgressCounter, Stopwatch){
  var keys = [];
  var data;
  var progressCounter;
  var timer;
  var unusedTerms = [];

  $(document).ready(initPage);

  function initPage(){
    'use strict';
    $.getJSON("./terms.json", function (json_data) {
      data = json_data;
      for(var key in data){
        keys.push(key);
      }
      unusedTerms = keys;
      setUp();
    }).done(initializeObjects);
  }


  function initializeObjects() { 
    progressCounter = new ProgressCounter(keys.length+1);
    progressCounter.onChange = function(){
      var progress = $("<div>", {
        text: this.numberOfTermsRead() + '|' + this.numberOfTerms
      });
      $('#topright').empty();
      progress.appendTo('#topright').addClass("animated pulse");
    };
    // we are only calling this here in order for the progress
    // to display in the html from the very beginning on
    progressCounter.onChange();
    timer = new Stopwatch();
    timer.start();
  }

  function setUp(){
    $('#choices').empty();
    $('#definiton').empty();
    var term = unusedTerms.popRandomElement();
    var choices = [];
    createDefinitionFor(term);
    choices.push(term);
    for (var j=0; j < 3; j++) {
      choices.push(keys.randomElement());
    }
    choices.shuffle();
    for (var i = choices.length - 1; i >= 0; i--){
      createButton(choices[i]);
    }
  }


  function createDefinitionFor(term){
    var definition = censorOutTerm(term, data[term].description);
    var definitionBlock = $("<div />", {html: definition});
    definitionBlock.appendTo('#definiton');
  }

  function censorOutTerm(term, definition){
    var findallRegex = new RegExp("[a-zA-Z]*" + term + "[a-zA-Z]*", "gi");
    return definition.replace(findallRegex, "xxxx");
  }

  function handleCorrectAnswer(button){
    progressCounter.registerTerm(button.innerHTML);
    button.className = ("btn btn-success");
    setTimeout(setUp, 250);
  }


  function handleIncorrectAnswer(button){
    button.className = "btn btn-danger";
    setTimeout(checkIfScoreIsHighEnough, 250);
  }

  function checkIfScoreIsHighEnough(){
    var time = timer.ellapsed();
    var score = progressCounter.numberOfTermsRead();
    $.post("http://highscore.k-nut.eu/highscore/check",
      {
        score: score,
        time: time
      }).done(checkIfInTopTen); 
  }

  function checkIfInTopTen(callback){
    callback = JSON.parse(callback);
    if (callback.top10){
    promptUserForHighscore();
    }
    else {
      alert("Sie sind nicht in den Top 10 gelandet probieren Sie es doch noch mal");
      location.reload();
    }
  }


  function sendUserToHallOfFame(){
    window.location = window.location.origin + "/highscore.html";
  }

  function promptUserForHighscore(){
    var time = timer.ellapsed();
    var score = progressCounter.numberOfTermsRead();

    var message = "Sie haben " + 
      progressCounter.numberOfTermsRead() +
      ' von ' +
      progressCounter.numberOfTerms +
      ' in ' +
      timer.formatedTime() + 
      ' Minuten geschafft!\n Geben Sie Ihren Namen für den Highscore ein.';

    timer.clear();
    progressCounter.clear();

    var highscoreName = prompt(message);
    if (highscoreName){
      $.post("http://highscore.k-nut.eu/highscore",
        {name: highscoreName,
          score: score,
          time: time
        }).done(sendUserToHallOfFame); 
    }
    else{
      location.reload();
    }
    return false;
  }

  function checkAnswer(event){
    var clicked = event.target.innerHTML;
    var censored = censorOutTerm(clicked, data[clicked].description);
    if ($('#definiton div').text() === censored){
      handleCorrectAnswer(event.target);
    }
    else{
      handleIncorrectAnswer(event.target);
    }
  }

  function createButton (term) {
    var button = $("<button/>", {
      "class": "btn btn-info",
      text: term,
      on: {click: checkAnswer}
    });
    button.appendTo('#choices');
  }


});
