angular.module("komet.controllers").controller("HighscoreCtrl", ["$scope", "$http",
  function($scope, $http){
    "use strict";
    $scope.highscores = {};
    $http.get("http://localhost:5000/highscore")
      .then(function(res){
        $scope.highscores = res.data;
      });

      $scope.calculateMean = function (score){
        score = score.score; // TODO naming
        return Math.round(score.time / score.score * 10) / 10;
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
  }
]);
