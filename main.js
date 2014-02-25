/*jslint browser: true*/
/*global $, jQuery, console*/

var loadNewDefintition = function () {
    var term = window.location.hash.substr(1);
    changeDisplay(term);
};

function changeDisplay(term){
    console.log(items);
    var termObject = items[term];
    $("#main").empty();
    $( "<h1>", {html: term}).appendTo("#main");
    $( "<aside>", {html: termObject.synonym.join(",")}).appendTo("#main");
    $("<p>", {html: termObject.description}).appendTo("#main");
};

window.addEventListener("hashchange", loadNewDefintition, false);

var items = [];
$(document).ready(function () {
    'use strict';
    $.getJSON("/begriffe.json", function (data) {
        var terms = [];
        items = data;
        $.each(data, function( key, val ) {
            terms.push("<li><a href='#" + key + "'>" + key + "</a></li>");
        });
        console.log(terms);

        $( "<ul/>", {
            html: terms.join("")
        }).appendTo("nav");
    });
});
