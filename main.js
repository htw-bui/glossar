/*jslint browser: true*/
/*global $, jQuery, console*/

var loadNewDefintition = function () {
    var term = window.location.hash.substr(1);
    changeDisplay(term);
};

function changeDisplay(term){
    var termObject = items[term];
    $("#main").empty();
    $( "<h1>", {html: term}).appendTo("#main");
    var synonyms = [];
    $.each(termObject.synonyms, function(key, value){
        synonyms.push("<a href='#" + value + "'>" + value + "</a>");
    });
    $( "<aside>", {html: synonyms.join("")}).appendTo("#main");
    $("<p>", {html: termObject.description}).appendTo("#main");
};

window.addEventListener("hashchange", loadNewDefintition, false);

var items = [];
$(document).ready(function () {
    'use strict';
    $.getJSON("/generierte_begriffe.json", function (data) {
        var terms = [];
        items = data;
        $.each(data, function( key, val ) {
            terms.push("<li><a href='#" + key + "'>" + key + "</a></li>");
        });
        
        $( "<ul/>", {
            html: terms.join("")
        }).appendTo("nav");
    });
});
