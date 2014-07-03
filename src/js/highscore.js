/*jslint browser: true*/
/*global $, jQuery, console, requirejs*/


requirejs.config({
  paths: {
    "jquery": [
      "https://code.jquery.com/jquery-2.1.0",
      // If the CDN fails, load from this local module instead
      "lib/jquery"
    ],
    "moment": "moment-with-langs.min"
  }
});

require(["jquery", "timeutils", "moment", "config"], function($, timeutils, moment, config){
  moment.lang("de");

  var isThisMonth = function(month){
    if (moment().format("MMMM YYYY") === moment(month).format("MMMM YYYY")){
      return true;
    }
    return false;
  };

  function createTable(){
    var $table = $('<table>').addClass('table table-striped');
    var $tableHead = $('<thead>');
    var $row = $('<tr>');
    $row
    .append($('<th>').text('Punkte'))
    .append($('<th>').text('Zeit (Ø)'))
    .append($('<th>').text('Name'))
    .append($('<th>').text('Datum'));
    $row.appendTo($tableHead);
    $tableHead.appendTo($table);
    return $table;
  }

  function createTableBodyWithScores(scores, limitTo3){
    var $tbody = $('<tbody>');
    if (limitTo3){
      scores = scores.slice(0,3);
    }
    $.each(scores, function(key, value){
      var row = $("<tr />");
      var mean = Math.round((value.time/1000)/value.score*10)/10;
      row
      .append($('<td>').text(value.score))
      .append($('<td>').text(timeutils.convertMillisecondsToFormatedTime(value.time) + ' (' + mean + ')'))
      .append($('<td>').text(value.name))
      .append($('<td>').text(moment(value.datetime).format("D.MM.YY HH:mm")));

      row.appendTo($tbody);
    });
    return $tbody;
  }

  $.getJSON(config.highscoreBaseUrl + "/highscore", function(data){
    var month;
    var heading;
    var shouldPrepend = false;
    var only3 = false;
    var $table;
    var $tbody;
    var $title;
    for (month in data){
      if (month === 'allTime'){
        heading = 'All Time';
        shouldPrepend = false;
      }
      else{
        heading = moment(month).format("MMMM YYYY");
        shouldPrepend = true;
        only3 = isThisMonth(month) ? false : true;
      }
      $table = createTable();
      $tbody = createTableBodyWithScores(data[month], only3);
      $tbody.appendTo($table);
      if (shouldPrepend){
        $table.prependTo('content');
      }
      else {
        $table.appendTo('content');
      }
      $title = $('<h2>').text(heading);
      $title.insertBefore($table);
    }
  });
});


