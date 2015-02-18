angular.module("komet.controllers").controller("GameCtrl", ["$scope", "$http", "$location", "$timeout", "stopwatch", "$route", "$translate", function($scope, $http, $location, $timeout, Stopwatch, $route, $translate){
  "use strict";
  $scope.choices = [];
  $scope.activeTerm = {};
  $scope.unusedTerms = {};
  $scope.progressCounter = {};
  $scope.timer = new Stopwatch();

  $http.get("/data/terms-international-censored.json")
  .then(function(res){
    $scope.terms = res.data;
    $scope.unusedTerms = res.data;
    $scope.progressCounter = new ProgressCounter(res.data.length);
    $scope.timer.start("game");
  }).then(pickTerm);

  $scope.$on("$destroy", function() {
    // Make sure that the interval is destroyed too
    $scope.timer.stopTimer();
  });

  function pickTerm(){
    var choices = [];
    $scope.activeTerm = $scope.unusedTerms.popRandomElement();
    choices.push($scope.activeTerm);
    var randomTerm;
    while(choices.length < 4){
      randomTerm = $scope.terms.randomElement();
      if (choices.indexOf(randomTerm) === -1){
        choices.push(randomTerm);
      }
    }
    $scope.choices = choices.shuffle();
  }

  $scope.checkAnswer = function(button, $event){
    var term = button.choice;
    var answerIsCorrect = (term === $scope.activeTerm);
    if (answerIsCorrect){
      $scope.progressCounter.registerTerm(term);
      $scope.unusedTerms.remove(term);
      $($event.target).removeClass("btn-info").addClass("btn-success");
      $timeout(pickTerm, 250);
    }
    else{
      $($event.target).removeClass("btn-info").addClass("btn-danger");
      $http.post("http://localhost:5000/highscore/check", {
        score: $scope.progressCounter.numberOfTermsRead(),
        time: $scope.timer.getTime()
      }).then(checkIfScoreIsHighEnough).then(function(){
        $scope.progressCounter.clear();
        $scope.timer.clearTimer();
      });
    }
  };

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
            $http.post("http://localhost:5000/highscore", { score: score, time: time, name: userName}).success(function(){
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
