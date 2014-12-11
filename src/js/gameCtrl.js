angular.module("komet.controllers").controller("GameCtrl" , ["$scope", "$http", "$location", "$timeout", "stopwatch", "$route", function($scope, $http, $location, $timeout, Stopwatch, $route){
  $scope.choices = [];
  $scope.activeTerm = {};
  $scope.unusedTerms = {};
  $scope.progressCounter = {};
  $scope.timer = new Stopwatch();

  $http.get("/data/terms-en.json")
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
    while(choices.length < 4){
      var randomTerm = $scope.terms.randomElement();
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
      bootbox.alert("Sie haben es leider nicht in die Top10 geschafft. <br /> Probieren Sie es doch noch einmal!");
      $route.reload();
    }
  }

  function promptUserForName(){
    var score = $scope.progressCounter.numberOfTermsRead();
    var time = $scope.timer.getTime();
    bootbox.prompt({"title": "Sie haben es in die Top 10 geschaft! <br /> Bitte geben Sie Ihren Namen für den Highscore an",
      value: localStorage.getItem("lastUsername") || "",
      callback: function(userName){
        if (userName){
          $http.post("http://localhost:5000/highscore", { score: score, time:time, name:userName}).success(function(){
            localStorage.setItem("lastUsername", userName);
            $location.path("/highscore");});
        }
        else {
          $route.reload();
        }
      }
    });
  }

}]);
