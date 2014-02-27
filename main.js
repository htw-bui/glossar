/*jslint browser: true*/
/*global $, jQuery, console*/

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
    
    checkPaginationVisibilty();
};

var loadNewDefintition = function () {
    var term = window.location.hash.substr(1);
    changeDisplay(term);
};

window.addEventListener("hashchange", loadNewDefintition, false);

var items = [];
var terms = [];
$(document).ready(function () {
    'use strict';
    $.getJSON("/generierte_begriffe.json", function (data) {
        items = data;
        var navTerms = [];
        $.each(data, function( key, val ) {
            terms.push(key);
            navTerms.push("<li><a href='#" + key + "'>" + key + "</a></li>");
        });
        
        $( "<ul/>", {
            html: navTerms.join("")
        }).appendTo("nav");
    }).done(function() {loadNewDefintition();});
});

function checkPaginationVisibilty(){
    var term = window.location.hash.substr(1);
    positionOfSelectedTerm = terms.indexOf(term);
    numberOfTerms = terms.length;
    $("#nextTerm").show();
    $("#previousTerm").show();
    if (positionOfSelectedTerm === 0){
        $("#previousTerm").hide();
        return;
    }
    if (positionOfSelectedTerm === (numberOfTerms - 1) ){
        $("#nextTerm").hide();
        return;
    }
}
    

function getPreviousTerm(){
    var term = window.location.hash.substr(1);
    positionOfSelectedTerm = terms.indexOf(term);
    previousTerm = terms[positionOfSelectedTerm - 1];
    window.location.hash = previousTerm;
}
function getNextTerm(){
    var term = window.location.hash.substr(1);
    positionOfSelectedTerm = terms.indexOf(term);
    nextTerm = terms[positionOfSelectedTerm +1];
    window.location.hash = nextTerm;
}
