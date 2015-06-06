angular.module("komet.controllers").controller("DashboardController", ["$scope", "$http", "$location", "$translate", function($scope, $http, $location, $translate){
  "use strict";
  $scope.searchTerm = "";
  $scope.terms = [{"term-english": "dummy", "term-german": "dummy"}];
  $scope.selectedTerm = {};
  $scope.progressCounter = {};
  $scope.selectedLang = "";

  $scope.changeLang = function (key) {
    localStorage.setItem("language", key);
    $translate.use(key);
    $scope.selectedLang = key;
    bootbox.setLocale(key);
    moment.locale(key);
  };

  var savedLanguage = localStorage.getItem("language") || "en";
  $scope.changeLang(savedLanguage);


  $http.get("./data/terms-international-with-categories-linked.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.selectedTerm = res.data[0];
    $scope.progressCounter = new ProgressCounter("glossary", res.data.length);
  }).then(loadTermFromHash);

  $scope.filter = function(term){
    var selectedLanguage = $translate.use();
    var property = selectedLanguage === "en" ? "term-english" : "term-german";
    return _.includes(term[property].toLowerCase(), $scope.searchTerm.toLowerCase());
  };

  $scope.$on("$routeUpdate", function(){
    loadTermFromHash();
  });

  $scope.setSelectedItem = function(term){
    setSelectedTerm(term.term);
  };

  $scope.toggleNavigation = function(){
    $scope.navOpen = !$scope.navOpen;
  };

  $scope.isActive = function(path){
    return $location.path() === path;
  };

  $scope.resetProgress = function(){
    $scope.progressCounter.clear();
  };

  function setSelectedTerm(term){
    $scope.progressCounter.registerTerm(term);
    $scope.selectedTerm = term;
    $location.search("term", term["term-english"]);
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
    return $scope.terms[0] === $scope.selectedTerm;
  };

  $scope.selectedTermIsLastTerm = function(){
    return _.last($scope.terms) === $scope.selectedTerm;
  };


  function getIndexOfSelectedTerm(){
    return _.findIndex($scope.terms, function(term){
      return $scope.selectedTerm === term;
    });
  }

  function loadTermFromHash(){
    if($location.search().term){
      $scope.selectedTerm = _.find($scope.terms, function(term){
        return term["term-english"] === $location.search().term || term["term-german"] === $location.search().term;
      });
    }
  }
}]);
