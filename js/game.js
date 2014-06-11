/*global requirejs, define*/
/*jslint browser: true*/

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
  var correctAnswer;

  $(document).ready(initPage);

  function initPage(){
    'use strict';
    $.getJSON("./terms.json", function (json_data) {
      var key;
      data = json_data;
      for(key in data){
        if (data.hasOwnProperty(key)){
          keys.push(key);
          unusedTerms.push(key);
        }
      }
      setUp();
    }).done(initializeObjects);
  }

  function restartPulseAnimation(){
    $('#pc').removeClass().addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
    });
  }

  function initializeObjects() { 
    progressCounter = new ProgressCounter(keys.length);
    progressCounter.onChange = function(){
      $("#progressCounter").text(this.numberOfTermsRead() + '|' + this.numberOfTerms);
      restartPulseAnimation();
    };
    // we are only calling this here in order for the progress
    // to display in the html from the very beginning on
    progressCounter.onChange();
    timer = new Stopwatch();
    timer.execute = function(){
      $("#timer").text(this.formatedTime());
    };

    timer.start();
  }

  function setUp(){
    if (unusedTerms.length === 0){
      checkIfScoreIsHighEnough();
    }
    else {
      var term = unusedTerms.popRandomElement();
      createDefinitionFor(term);
      createAllChoiceButtons(term);
    }
  }

  function getTermsBelongingToCategory(selectedCategory){
    var terms = [];
    var key, categories;
    for (key in data){
      if (data.hasOwnProperty(key)){
        categories = data[key].categories;
        if (categories.indexOf(selectedCategory) !== -1){
          terms.push(key);
        }
      }
    }
    return terms;
  }

  function assert(test){
    if (!test){
      throw "Assertion failed";
    }
  }

  function createAllChoiceButtons(term){
    var i, choices;
    $('#choices').empty();

    choices = [];
    choices.push(term);

    var randomCategory = data[term].categories.randomElement();
    var termsBelongingToCategory = getTermsBelongingToCategory(randomCategory);

    // the selected term should not be in the choices since we already included it above
    termsBelongingToCategory.remove(term); 

    while(choices.length <4){
      choices.push(termsBelongingToCategory.popRandomElement());
    }

    choices.shuffle();
    correctAnswer = choices.indexOf(term);
    for (i = 0; i < choices.length; i++){
      createButton(choices[i], i);
      assert(data[choices[i]].categories.indexOf(randomCategory) !== -1);
    }
  }

  function createDefinitionFor(term){
    $('#definiton').empty();
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
    var $correctAnswer = $("#choices").children().eq(correctAnswer);
    $correctAnswer.removeClass("btn-info");
    $correctAnswer.addClass("btn-success");
    setTimeout(checkIfScoreIsHighEnough, 1000);
  }

  function checkIfScoreIsHighEnough(){
    var time = timer.ellapsed();
    var score = progressCounter.numberOfTermsRead();
    $.post("http://highscore.k-nut.eu/highscore/check",
      {
        score: score,
        time: time
      }).done(handleTopTenResponse)
      .error(handleHighscoreIfNoConnection); 
  }

  function handleHighscoreIfNoConnection(){
    alert("Es konnte keine Verbindung zum Server hergestellt werden.");
    resetAndReload();
  }

  function handleTopTenResponse(callback){
    callback = JSON.parse(callback);
    if (callback.top10){
      promptUserForHighscore();
    }
    else {
      alert("Sie sind nicht in den Top 10 gelandet probieren Sie es doch noch mal");
      resetAndReload();
    }
  }

  function resetAndReload(){
    timer.clear();
    progressCounter.clear();
    location.reload();
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
        }).done(sendUserToHallOfFame)
        .error(handleHighscoreIfNoConnection); 
    }
    else{
      location.reload();
    }
    return false;
  }

  function checkAnswer(event){
    if ($(this).data("position") === correctAnswer){
      handleCorrectAnswer(event.target);
    }
    else{
      handleIncorrectAnswer(event.target);
    }
  }

  function createButton (term, position) {
    var button = $("<button/>", {
      "class": "btn btn-info",
      text: term,
      on: {click: checkAnswer},
      data: {"position": position}
    });
    button.appendTo('#choices');
  }
});
