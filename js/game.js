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
    $.getJSON("/terms.json", function (json_data) {
      data = json_data;
      for(var key in data){
        keys.push(key);
      }
      unusedTerms = keys;
      setUp();
    }).done(initializeObjects);
  }


  function initializeObjects() { 
    progressCounter = new ProgressCounter(keys.length);
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

  function createButton (term) {
    var button = $("<a/>", {
      "class": "choice",
      text: term, href: '#',
      on: {
        click: function(event){
          var clicked = event.target.innerHTML;
          var censored = censorOutTerm(clicked, data[clicked].description);
          if ($('#definiton div').text() === censored){
            setUp();
            progressCounter.registerTerm(clicked);
          }
          else{
            var message = "Sie haben " + 
              progressCounter.numberOfTermsRead() +
              ' von ' +
              progressCounter.numberOfTerms +
              ' in ' +
              timer.formatedTime() + 
              ' Minuten geschafft!';
            alert(message);
            timer.clear();
            progressCounter.clear();
          }
          return false;
        }
      }
    });
    button.appendTo('#choices');
  }


});
