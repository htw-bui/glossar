/*jslint browser: true*/
/*global $, jQuery, console*/

function changeTo(term){
	window.location.hash = term;
	checkPaginationVisibilty();
	setActiveItemInNavigation(term);
}

function setActiveItemInNavigation(term){
	var position = terms.indexOf(term);
	$("nav ul a").each( function () {
		$(this).removeClass("active-item");
	});
	$("nav ul a").eq(position).addClass("active-item");
}


var loadNewDefintition = function () {
	var term = window.location.hash.substr(1);
	if (term === "" || terms.indexOf(term)===-1) {
		window.location.hash = "#" + terms[0]
		term = window.location.hash.substr(1);
	}
	window.mySwipe.slide(terms.indexOf(term));
};

function swipeTo(term){
	window.mySwipe.slide(terms.indexOf(term));
}

window.addEventListener("hashchange", loadNewDefintition, false);

var items = [];
var terms = [];
$(document).ready(function () {
	'use strict';
	$.getJSON("/neu_generierte_begriffe.json", function (data) {
		items = data;
		$.each(data, function( key, val ) {


			var newSlide = $("<div>");
			var termObject = val;
			var synonyms = [];
			$( "<h1>", {html: key}).appendTo(newSlide);
			$.each(termObject.synonyms, function(key, value){
				synonyms.push("<a href='#" + value + "'>" + value + "</a>");
			});
			$( "<aside>", {html: synonyms.join("")}).appendTo(newSlide);
			$("<p>", {html: termObject.description}).appendTo(newSlide);
			newSlide.appendTo(".swipe-wrap");

			terms.push(key);
		});
		createNaviagtion(terms);
	}).done(function() {
		window.mySwipe = Swipe(document.getElementById('content'), {
			continous: false,
			callback: function(index, element){
				changeTo(terms[index]);
			}
		});
		loadNewDefintition();

	});

});


function createNaviagtion(data){
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
	$("#main").bind("click", function() {closeNav()})
	$("header").bind("click", function() {closeNav()})
}


function checkPaginationVisibilty(){
	var term = window.location.hash.substr(1);
	positionOfSelectedTerm = terms.indexOf(term);
	numberOfTerms = terms.length;
	$("#nextTerm").prop("disabled", false);
	$("#previousTerm").prop("disbaled", false);
	if (positionOfSelectedTerm === 0){
		$("#previousTerm").prop("disabled", false);
		return;
	}
	if (positionOfSelectedTerm === (numberOfTerms - 1) ){
		$("#nextTerm").prop("disabled", false);
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
	window.mySwipe.prev()
}
function getNextTerm(){
	window.mySwipe.next()
}


function filterNavigation(){
	filteredItems = jQuery.extend([], terms);
	filteredItems = filteredItems.filter(filterBySearchTerm);
	createNaviagtion(filteredItems);
}



function filterBySearchTerm(term){
	var searchTerm = $("#filterTerms").val();
	if (term.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
		return true;
	}
	return false;
}
