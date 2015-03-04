angular.module("komet.controllers").controller("GameCtrl", ["$scope", "$http", "$location", "$timeout", "stopwatch", "$route", "$translate", function($scope, $http, $location, $timeout, Stopwatch, $route, $translate){
  "use strict";
  $scope.choices = [];
  $scope.activeTerm = {};
  $scope.unusedTerms = {};
  $scope.progressCounter = {};
  $scope.timer = new Stopwatch();
  $scope.buttonsDisabled = false;

  $http.get("/data/terms-international-censored.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.progressCounter = new ProgressCounter("game", res.data.length);
    $scope.timer.start("game");
    var readTerms = _.map($scope.progressCounter.getReadTerms(), function(term){
      return term["term-english"];
    });
    $scope.unusedTerms = _.filter(res.data, function(term){
      return readTerms.indexOf(term["term-english"]) === -1;
    });
  }).then(pickTerm);

$scope.$on("$destroy", function() {
  // Make sure that the interval is destroyed too
  $scope.timer.stopTimer();
});

function pickTerm(){
  var choices = [];
  $scope.activeTerm = $scope.unusedTerms.popRandomElement();
  choices.push($scope.activeTerm);
  var category = $scope.activeTerm.categories.randomElement();
  var termsForThisCategory = _.filter($scope.terms, function(term){
    return term.categories.indexOf(category) !== -1;
  });
  var randomTerm;
  while(choices.length < 4){
    randomTerm = termsForThisCategory.randomElement();
    if (choices.indexOf(randomTerm) === -1){
      choices.push(randomTerm);
    }
  }
  $scope.choices = _.map(_.shuffle(choices), function(choice){
    choice.buttonState = "btn-info";
    return choice;
  });
}

$scope.checkAnswer = function(button){
  var term = button.choice;
  var answerIsCorrect = (term === $scope.activeTerm);
  if (answerIsCorrect){
    $scope.progressCounter.registerTerm(term);

    _.remove($scope.unusedTerms, function(unusedTerm){
      return unusedTerm === term["term-english"];
    });

    button.choice.buttonState = "btn-success";

    var thereStillAreQuestions = ($scope.unusedTerms.length !== 0);

    if (thereStillAreQuestions){
      $timeout(pickTerm, 500);
    }
    else{
      $timeout(postScoreToServer, 250);
    }
  }
  else{
    $scope.buttonsDisabled = true;
    button.choice.buttonState = "btn-danger";
    $scope.activeTerm.buttonState = "btn-success";
    $timeout(postScoreToServer, 1000);
  }
};


function postScoreToServer(){
  $http.post("http://highscore-angular.k-nut.eu/highscore/check", {
    score: $scope.progressCounter.numberOfTermsRead(),
    time: $scope.timer.getTime()
  }).then(checkIfScoreIsHighEnough).then(function(){
    $scope.progressCounter.clear();
    $scope.timer.clearTimer();
  });
}

function checkIfScoreIsHighEnough(response){
  var inTop10 = response.data.top10;
  if (inTop10){
    promptUserForName();
  }
  else{
    $translate("FAIL_MESSAGE").then(function(message){
      bootbox.alert(message);
      $route.reload();
    });
  }
}

function promptUserForName(){
  var score = $scope.progressCounter.numberOfTermsRead();
  var time = $scope.timer.getTime();
  $translate("TOP10_MESSAGE").then(function(message){
    bootbox.prompt({"title": message,
      value: localStorage.getItem("lastUsername") || "",
      callback: function(userName){
        if (userName){
          $http.post("http://highscore-angular.k-nut.eu/highscore", { score: score, time: time, name: userName}).success(function(){
            localStorage.setItem("lastUsername", userName);
            $location.path("/highscore");});
        }
        else {
          $route.reload();
        }
      }
    });
  });
}

}]);
