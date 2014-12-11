(function(){
  "use strict";


  var kometControllers = angular.module("kometControllers", [])
  .factory("stopwatch", ["$interval", function($interval){
    var self = this;
    self.seconds = JSON.parse(localStorage.getItem("timer.ellapsed")) || 0;

    var getTime = function(){
      return self.seconds;
    };

    var stopTimer = function(){
      $interval.cancel(self.interval);
    };

    var start = function () {
      self.interval = $interval(function(){
        self.seconds++;
        localStorage.setItem("timer.ellapsed", self.seconds);
      }, 1000);
    };

    var clearTimer = function(){
      self.seconds = 0;
      localStorage.setItem("timer.ellapsed", self.seconds);
    };

    function StopWatch(){
      return {getTime: getTime, seconds:self.seconds, start:start, stopTimer: stopTimer, clearTimer: clearTimer};
    }

    return StopWatch;
  }
  ]);


  kometControllers.controller("HighscoreCtrl", ["$scope", "$http", 
    function($scope, $http){
      $scope.highscores = {};
      $http.get("http://localhost:5000/highscore")
        .then(function(res){
          $scope.highscores = res.data;
        });

        $scope.calculateMean = function (score){
          score = score.score; // TODO naming
          return Math.round(score.time/ score.score * 10) / 10;
        };

        $scope.getMonthAndYear = function(date){
          if (date !== "allTime"){
            return moment(date).format("MMMM YYYY");
          }
          else{
            return "All Time";
          }
        };

        $scope.getFormatedDate = function(date){
          return moment(date).format("lll");
        };

        $scope.highscoreSort = function(scoreList){
          return scoreList.name;
        };

    }
  ]);

  kometControllers.controller("GameCtrl" , ["$scope", "$http", "$location", "$timeout", "stopwatch", "$route", function($scope, $http, $location, $timeout, Stopwatch, $route){
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
      bootbox.prompt("Sie haben es in die Top 10 geschaft! <br /> Bitte geben Sie Ihren Namen für den Highscore an", function(userName){
        if (userName){
          $http.post("http://localhost:5000/highscore", { score: score, time:time, name:userName}).success(function(){
            $location.path("/highscore");});
        }
        else {
          $route.reload();
        }
      });
    }

  }]);

  kometControllers.controller("DashboardController" , ["$scope", "$http", "$location", function($scope, $http, $location){
    $scope.searchTerm = "";
    $scope.terms = [{"term": "dummy"}];
    $scope.selectedTerm = {};
    $scope.progressCounter = {};

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
  }]);
})();
