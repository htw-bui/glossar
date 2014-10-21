(function(){
  "use strict";
  var app = angular.module("dashboard", [
    "ngRoute",
    "kometControllers"
  ]);

  app.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.
      when('/glossary', {
        templateUrl: 'glossary.html',
        controller: 'DashboardController',
        reloadOnSearch: false
      }).
      when('/highscore', {
        templateUrl: 'highscore.html',
        controller: "HighscoreCtrl"
        }).
      otherwise({
        redirectTo: '/highscore'
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
