angular.module("komet.controllers").controller("DashboardController" , ["$scope", "$http", "$location", "$translate", function($scope, $http, $location, $translate){
  $scope.searchTerm = "";
  $scope.terms = [{"term": "dummy"}];
  $scope.selectedTerm = {};
  $scope.progressCounter = {};

  $http.get("/data/terms-international.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.selectedTerm = res.data[0];
    $scope.progressCounter = new ProgressCounter(res.data.length);
  }).then(loadTermFromHash);

  $scope.filter = function(term){
	  return true;
	  try {
	  	
    return term["term-english"].toLowerCase().contains($scope.searchTerm.toLowerCase());
	  } catch (e) {
		  console.log(e);
	  	/* handle error */
	  }
  };

  $scope.changeLang = function () {
    var key = $translate.use() == "de"? "en" : "de";
    $translate.use(key);
  };

  $scope.setSelectedItem = function(term){
    setSelectedTerm(term.term);
  };

  $scope.toggleNavigation = function(){
    $scope.navOpen = !$scope.navOpen;
  }

  $scope.isActive = function(path){
    return $location.path() === path;
  };

  $scope.resetProgress = function(){
    $scope.progressCounter.clear();
  };

  function setSelectedTerm(term){
    $scope.progressCounter.registerTerm(term.term);
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
        return term["term-english"] === $location.search().term;
      });
    }
  }
}]);
