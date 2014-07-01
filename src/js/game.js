/*global requirejs, define, Hyphenator, prompt, alert, handleCorrectAnswer*/
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


define(['jquery', 'ProgressCounter', 'stopwatch', 'utils', 'config'], function($, ProgressCounter, Stopwatch, utils, config){
  var keys = [];
  var data;
  var progressCounter;
  var timer;
  var unusedTerms = [];
  var correctAnswer;
  var uncensored_data;
  var correctTerm;
  var baseUrl = config.highscoreBaseUrl;

  function sendUserToHallOfFame(){
    window.location = "./highscore.html";
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


  function resetAndReload(){
    timer.clear();
    progressCounter.clear();
    location.reload();
  }

  function handleHighscoreIfNoConnection(){
    alert("Es konnte keine Verbindung zum Server hergestellt werden.");
    resetAndReload();
  }

  function promptUserForHighscore(){
    var time = timer.ellapsed();
    var score = progressCounter.numberOfTermsRead();

    var message = "Sie haben " + 
      progressCounter.numberOfTermsRead() +
      ' von ' +
      progressCounter.numberOfTerms +
      ' Quizfragen in ' +
      timer.formatedTime() + 
      ' Minuten gelöst!\n Geben Sie Ihren Namen für den Highscore ein.';

    timer.clear();
    progressCounter.clear();

    var highscoreName = prompt(message);
    if (highscoreName){
      $.post(baseUrl + "/highscore",
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

  function handleTopTenResponse(callback){
    if (callback.top10){
      promptUserForHighscore();
    }
    else {
      tellUserThatHeIsNotGoodEnoughAndReset();
    }
  }

  function tellUserThatHeIsNotGoodEnoughAndReset(){
    alert("Sie sind nicht in den Top 10 gelandet probieren Sie es doch noch mal");
    resetAndReload();
  }



  function checkIfScoreIsHighEnough(){
    var time = timer.ellapsed();
    var score = progressCounter.numberOfTermsRead();
    if (score > 0){
      $.post(baseUrl + "/highscore/check",
        {
          score: score,
          time: time
        }).done(handleTopTenResponse)
        .error(handleHighscoreIfNoConnection); 
    }
    else {
      tellUserThatHeIsNotGoodEnoughAndReset();
    }
  }

  function replaceDefintionWithUncesonredVersion(){
    var definition = uncensored_data[correctTerm].description;
    $('#definition').text(definition);
    Hyphenator.run();
  }

  function handleIncorrectAnswer(button){
    $("button").prop("disabled", true);
    button.className = "btn btn-danger";
    var $correctAnswer = $("#choices").children().eq(correctAnswer);
    $correctAnswer.removeClass("btn-info");
    $correctAnswer.addClass("btn-success");
    replaceDefintionWithUncesonredVersion();
    setTimeout(checkIfScoreIsHighEnough, 1000);
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
      utils.assert(data[choices[i]].categories.indexOf(randomCategory) !== -1);
    }
  }

  function censorOutTerm(term, definition){
    var findallRegex = new RegExp("[a-zA-Z]*" + term + "[a-zA-Z]*", "gi");
    return definition.replace(findallRegex, "xxxx");
  }

  function createDefinitionFor(term){
    var definition = censorOutTerm(term, data[term].description);
    $('#definition').text(definition);
    Hyphenator.run();
  }


  function setUp(){
    if (unusedTerms.length === 0){
      checkIfScoreIsHighEnough();
    }
    else {
      var term = unusedTerms.randomElement();
      correctTerm = term;
      $('.container').fadeOut( function(){
        createDefinitionFor(term);
        createAllChoiceButtons(term);
        $('.container').fadeIn();
      });
    }
  }

  function handleCorrectAnswer(button){
    var term = button.innerHTML;
    progressCounter.registerTerm(term);
    unusedTerms.remove(term);
    button.className = ("btn btn-success");
    setTimeout(setUp, 250);
  }

  function restartPulseAnimation(){
    $('#pc').removeClass().addClass('animated pulse').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass();
    });
  }

  function removeStoredTermsFromUnusedTerms(){
    $.each(progressCounter.getReadTerms(), function(key, term){
      unusedTerms.remove(term);
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
    removeStoredTermsFromUnusedTerms();
  }


  function initPage(){
    'use strict';
    $.getJSON("./data/terms.json", function (json_data) {
      var key;
      data = json_data;
      for(key in data){
        if (data.hasOwnProperty(key)){
          keys.push(key);
          unusedTerms.push(key);
        }
      }
    }).then(initializeObjects).then(setUp);
    $.getJSON("./data/terms-nocensor.json", function (json_data) {
      uncensored_data = json_data;
    });
  }

  $(document).ready(initPage);
});
