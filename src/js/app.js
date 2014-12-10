(function(){
  "use strict";

  moment.locale("de");


  angular.module('kometFilters', []).filter('formatedTime', function() {
    return function(totalSeconds) {
      var minutes = pad(Math.floor(totalSeconds / 60));
      var seconds = pad(totalSeconds % 60);
      return minutes +  ":" + seconds;

      function pad(n){
        return n < 10 ? "0" + n : n;
      }
    };
  });

  var app = angular.module("dashboard", [
    "ngRoute",
    "kometControllers",
    "kometFilters"
  ]);

  app.config(["$routeProvider",
    function($routeProvider) {
      $routeProvider.
      when("/glossary", {
        templateUrl: "glossary.html",
        controller: "DashboardController",
        reloadOnSearch: false
      }).
      when("/highscore", {
        templateUrl: "highscore.html",
        controller: "HighscoreCtrl"
      }).
      when("/game", {
        templateUrl: "game.html",
        controller: "GameCtrl"
      }).
      otherwise({
        redirectTo: "/highscore"
      });
    }]);


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



})();
