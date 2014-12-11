angular.module("komet.controllers").controller("DashboardController" , ["$scope", "$http", "$location", function($scope, $http, $location){
  $scope.searchTerm = "";
  $scope.terms = [{"term": "dummy"}];
  $scope.selectedTerm = {};
  $scope.progressCounter = {};
  $scope.showNav = true;

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

  $scope.isActive = function(path){
    return $location.path() === path;
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
}]);
