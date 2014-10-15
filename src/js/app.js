(function(){
  "use strict";
  var app = angular.module("dashboard", []);


  app.directive("navigationList", function(){
    return {
      restrict: "A",
      templateUrl: "navigation-list.html"
    };
  });

  app.directive("topNavigation", function(){
    return {
      restrict: "A",
      templateUrl: "top-navigation.html"
    };
  });

  app.directive("glossaryControl", function(){
    return {
      restrict: "A",
      templateUrl: "glossary.html"
    };
  });

  app.directive("highscoreView", function(){
    return {
      restrict: "E",
      templateUrl: "highscore.html",
      controller: function($scope, $http){
        $scope.highscores = {};
        $http.get("http://highscore.k-nut.eu/highscore")
          .then(function(res){
            $scope.highscores = res.data;
            window.s = res.data;
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
    };
  });

  app.controller("DashboardController" , function($scope, $http){
    $scope.tab = 2;
    $scope.searchTerm = "";
    $scope.terms = [{"term": "dummy"}];
    $scope.selectedTerm = {};
    $scope.progressCounter = {};
    $scope.stopWatch = {};

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
      window.location.hash = term.term;
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
      if(window.location.hash){
        $scope.selectedTerm = _.find($scope.terms, function(term){
          return term.term === window.location.hash.substring(1);
        });
      }
    }
  });

})();
