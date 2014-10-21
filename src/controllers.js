"use strict";

var kometControllers = angular.module("kometControllers", []);

kometControllers.controller("HighscoreCtrl", ["$scope", "$http", 
  function($scope, $http){
    $scope.highscores = {};
    $http.get("http://highscore.k-nut.eu/highscore")
      .then(function(res){
        $scope.highscores = res.data;
      });
      $scope.calculateMean = function (score){
        score = score.score; // TODO naming
        return Math.round((score.time / 1000) / score.score * 10) / 10;
      };
      $scope.getMonthAndYear = function(date){
        moment.lang("de");
        return moment(date).format("MMMM YYYY");
      };
      $scope.parseDate = function(date){
        return Date.parse(date);
      };
  }
]);

kometControllers.controller("GameCtrl" , function($scope, $http, $routeParams, $location){
  $scope.choices = [];
  $scope.activeTerm = {};
  $scope.unusedTerms = {};

  $http.get("/data/terms-en.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.unusedTerms = res.data;
  }).then(pickTerm)

  function pickTerm(){
    var choices = [];
    $scope.activeTerm = $scope.unusedTerms.popRandomElement()
    choices.push($scope.activeTerm);
    while(choices.length < 4){
      var randomTerm = $scope.terms.randomElement()
      if (choices.indexOf(randomTerm) === -1){
        choices.push(randomTerm);
      }
    }
    $scope.choices = choices.shuffle();
  }

  $scope.checkAnswer = function(button, $event){
    if (button.choice == $scope.activeTerm){
      //progressCounter.registerTerm(term);
      $scope.unusedTerms.remove(button.choice);
      window.b = button;
      $($event.target).removeClass("btn-info").addClass("btn-success");
      //setTimeout(setUp, 250);
    }
    else{
      console.log("fail");
    }
  }
});

kometControllers.controller("DashboardController" , function($scope, $http, $location){
  $scope.searchTerm = "";
  $scope.terms = [{"term": "dummy"}];
  $scope.selectedTerm = {};
  $scope.progressCounter = {};
  $scope.stopWatch = {};

  $scope.isActive = function(path) {
    return $location.path().substr(0, path.length) == path
  }

  $http.get("/data/terms-en.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.selectedTerm = res.data[0];
    $scope.progressCounter = new ProgressCounter(res.data.length);
  }).then(loadTermFromHash);

  $scope.filter = function(term){
    return term.term.toLowerCase().contains($scope.searchTerm.toLowerCase());
  };

  $scope.setSelectedItem = function(term){
    setSelectedTerm(term.term);
  };

  $scope.resetProgress = function(){
    $scope.progressCounter.clear();
  };

  function setSelectedTerm(term){
    $scope.progressCounter.registerTerm(term.term);
    $scope.selectedTerm = term;
    $location.search("term", term.term);
  }


  $scope.prevTerm = function(){
    var indexOfSelectedTerm = getIndexOfSelectedTerm();
    setSelectedTerm($scope.terms[indexOfSelectedTerm - 1]);
  };

  $scope.nextTerm = function(){
    var indexOfSelectedTerm = getIndexOfSelectedTerm();
    setSelectedTerm($scope.terms[indexOfSelectedTerm + 1]);
  };

  $scope.selectedTermIsFirstTerm = function(){
    return $scope.terms[0].term === $scope.selectedTerm.term;
  };

  $scope.selectedTermIsLastTerm = function(){
    return _.last($scope.terms).term === $scope.selectedTerm.term;
  };


  function getIndexOfSelectedTerm(){
    return _.findIndex($scope.terms, function(term){
      return $scope.selectedTerm.term === term.term;
    });
  }

  function loadTermFromHash(){
    if($location.hash()){
      $scope.selectedTerm = _.find($scope.terms, function(term){
        return term.term === $location.hash();
      });
    }
  }
});
