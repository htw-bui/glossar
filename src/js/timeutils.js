define(function() {
  "use strict";
  return {
    convertMillisecondsToFormatedTime : function (milliseconds){
      var total = milliseconds / 1000;
      var minutes = Math.floor(total / 60);
      var seconds = parseInt(total - minutes * 60, 10);
      var stringSeconds = seconds.toString();
      if (stringSeconds.length === 1){
        stringSeconds = "0" + stringSeconds;
      }
      return minutes + ":" + stringSeconds;
    }
  };
});
