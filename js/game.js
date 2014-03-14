requirejs.config({
  paths: {
    "jquery": [
      "https://code.jquery.com/jquery-2.1.0",
      // If the CDN fails, load from this local module instead
      "lib/jquery"
    ]
  }
});


define(['jquery', 'ProgressCounter', 'stopwatch'], function($, ProgressCounter, Stopwatch){
  var keys = [];
  var data;
  var progressCounter;
  var timer;

  $(document).ready(function () {
    'use strict';
    $.getJSON("/terms.json", function (json_data) {
      data = json_data;
      for(var key in data){
        keys.push(key);
      }
      setUp();
    }).done(function() { 
      progressCounter = new ProgressCounter(keys.length);
      timer = new Stopwatch();
      timer.clear();
      progressCounter.clear();
      timer.start();
    });


  });

  function setUp(){
    $('#choices').empty();
    $('#definiton').empty();
    var term = keys.randomElement();
    var choices = [];
    createDefinition(data[term].description);
    choices.push(term);
    for (var j=0; j < 3; j++) {
      choices.push(keys.randomElement());
    }
    choices = shuffle(choices);
    for (var i = choices.length - 1; i >= 0; i--){
      createButton(choices[i]);
    }

  }


  function createDefinition(definition){
    var definitionBlock = $("<div />", {html: definition});
    definitionBlock.appendTo('#definiton');
  }

  function createButton (term) {
    var button = $("<a/>", {
      "class": "choice",
      text: term, href: '#',
      on: {
        click: function(event){
          var clicked = event.target.innerText;
          if ($('#definiton div').text() === data[clicked].description){
            alert('Richtig');
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
          }
          return false;
        }
      }
    });
    button.appendTo('#choices');
  }

  Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  function shuffle(array) {
    var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
});
