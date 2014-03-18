/*jslint browser: true*/
/*global $, jQuery, console*/


requirejs.config({
  paths: {
    "jquery": [
      "https://code.jquery.com/jquery-2.1.0",
      // If the CDN fails, load from this local module instead
      "lib/jquery"
    ]
  }
});

require(["jquery"], function($){
  var scores = [];
  $.getJSON("http://highscore.k-nut.eu/highscore", function(data){
    $.each(data, function(key, value){
      scores.push("<tr> <td>" + value.score + "</td><td>" + formatedTime(value.time) + "</td><td>" + value.name + "</td></tr>");
    });
  }).done(function() {
    $("tbody").html(scores.join(""));
    console.log(scores);
  });


  function formatedTime(milliseconds){
    var total = milliseconds / 1000;
    var minutes = Math.floor(total/60);
    var seconds = parseInt(total - minutes*60, 10);
    var stringSeconds = seconds.toString();
    if (stringSeconds.length === 1){
      stringSeconds = '0' + stringSeconds;
    }
    return minutes + ":" + stringSeconds;
  }


});
