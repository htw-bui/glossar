(function(){
  "use strict";

  moment.locale("de");


  angular.module("kometFilters", []).filter("formatedTime", function() {
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
    "komet.controllers",
    "pascalprecht.translate",
    "kometFilters"
  ]);

  app.config(function($translateProvider){
    $translateProvider.translations("de", 
    {
    NEXT: "Weiter",
    PREV: "Zurück",
    CONTENT: "Inhalt",
    POINTS: "Punkte",
    TIME: "Zeit (Ø)",
    NAME: "Name",
    DATE: "Datum",
    IMPRINT: "Impressum",
    TOP10_MESSAGE: "Sie haben es in die Top 10 geschaft! Bitte geben Sie Ihren Namen für den Highscore an",
    FAIL_MESSAGE:"Sie haben es leider nicht in die Top10 geschafft. <br /> Probieren Sie es doch noch einmal!",
    GLOSSARY: "Glossar"
    });
    $translateProvider.translations("en", 
    {
    NEXT: "Next",
    PREV: "Previous",
    CONTENT: "Content",
    POINTS: "Points",
    TIME: "Time (Ø)",
    NAME: "Name",
    DATE: "Date",
    IMPRINT: "Imprint",
    TOP10_MESSAGE: "You made it into the top10! <br /> Please enter your name for the highscore.",
    FAIL_MESSAGE:"You did not make it into the top 10. <br /> Why don't you try again?!",
    GLOSSARY: "Glossary"
    });
    $translateProvider.preferredLanguage("en");
  });

  app.config(["$routeProvider", function($routeProvider){
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
