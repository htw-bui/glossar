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
    $.getJSON("/neu_generierte_begriffe.json", function (data) {
        items = data;
        $.each(data, function( key, val ) {
            terms.push(key);
        });
        createNaviagtion(terms);
    }).done(function() {loadNewDefintition();});
});

function createNaviagtion(data){
    console.log(data);
    $(".navItems").remove();
    var navTerms = [];
    $.each(data, function(key, val ) {
        navTerms.push("<li><a href='#" + val + "'>" + val + "</a></li>");
    });

    $( "<ul/>", {
        class: "navItems",
        html: navTerms.join("")
    }).appendTo("nav");
    $("nav a").bind("click", function() {closeNav()})
}


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

function showNav(){
    $("nav").addClass("nav-open");
    $("nav a").bind("click", function() {closeNav()})
}

function closeNav(){
    $("nav").removeClass("nav-open");
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


function filterNavigation(){
    filteredItems = jQuery.extend([], terms);
    filteredItems = filteredItems.filter(filterBySearchTerm);
    console.log(filteredItems);
    createNaviagtion(filteredItems);
}



function filterBySearchTerm(term){
    console.log(term);
    var searchTerm = $("#filterTerms").val();
    if (term.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
        return true;
    }
    return false;
}
