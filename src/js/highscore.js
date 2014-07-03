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
  $.getJSON(config.highscoreBaseUrl + "/highscore", function(data){
    var month;
    var heading;
    var shouldPrepend = false;
    for (month in data){
      if (month === 'allTime'){
        heading = 'All Time';
        shouldPrepend = false;
      }
      else{
        heading = moment(month).format("MMMM YYYY");
        shouldPrepend = true;
      }
      var $table = createTable(heading);
      var $tbody = createTableBodyWithScores(data[month]);
      $tbody.appendTo($table);
      if (shouldPrepend){
        $table.prependTo('content');
      }
      else {
        $table.appendTo('content');
      }
      var $title = $('<h2>').text(heading);
      $title.insertBefore($table);
    }
  })/*.done(addCollapseFunctionality)*/;

  function createTable(title){
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

  function createTableBodyWithScores(scores){
    var $tbody = $('<tbody>');
    $.each(scores, function(key, value){
      var place = parseInt(key, 10) + 1;
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

  function addCollapseFunctionality(){
    $('content h2').css('cursor', 'pointer')
    .click(function() {
      $('content h2').not(this).next('table').slideUp('slow');
      $(this).next('table').slideDown('slow');
      return false;
    }).next().hide();
    $('content h2:first').click();
  }

});

