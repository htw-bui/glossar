(function(){
  "use strict";

  angular.module("komet.controllers", []);

  angular.module("komet.controllers")
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
})();
