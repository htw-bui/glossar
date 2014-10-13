/*jslint browser: true*/
/*global $, jQuery, console, requirejs*/


requirejs.config({
  paths: {
    "jquery": [
      "https://code.jquery.com/jquery-2.1.0",
      // If the CDN fails, load from this local module instead
      "lib/jquery"
    ]
  }
});




require(["hyphenate", "ProgressCounter", "jquery", "stopwatch"], function(hyphenate, ProgressCounter, $, Stopwatch){
  "use strict";
  var n;
  var p;
  var timer;

  $(document).ready(initPage);


  function changeDisplay(term){
    var termObject =  n.getDefinition(term);
    p.registerTerm(term);

    document.title = "KOMET Glossar | " + term;

    $("#main").empty();
    $( "<h1>", {html: term, class:"hyphenate"}).appendTo("#main");

    var synonyms = [];
    $.each(termObject.synonyms, function(key, value){
      synonyms.push("<a href='#" + value + "'>" + value + "</a>");
    });
    $( "<aside>", {html: synonyms.join("")}).appendTo("#main");
    $("<p>", {html: termObject.description, class:"hyphenate"}).appendTo("#main");
    Hyphenator.run();
  }

  function setActiveItemInNavigation(){
    var position = n.selectedIndex;
    $("nav.termnav ul a").each( function () {
      $(this).removeClass("active-item");
    });
    $("#navigation" + position).addClass("active-item");
  }


  var loadNewDefintition = function () {
    var term = decodeURI(window.location.hash.substr(1));
    if (term === ""){
      term = window.location.hash = n.keys[0];
    }
    changeDisplay(term);
  };

  function initPage() {
    $.getJSON("./data/neu_generierte_begriffe.json", function (data) {
      p = new ProgressCounter(n.keys.length);
      p.onChange = function () {
        $("#progress").text(this.numberOfTermsRead() + "|" + this.numberOfTerms);
      };
      timer = new Stopwatch();
      timer.execute = function() {
        $("#time").text(this.formatedTime());
      };
      timer.start();
      createNaviagtion(n.keys);
    }).done(function(){loadNewDefintition();});

    $("#showNav").on("click", showNav);
    $("#filterTerms").on("keyup", filterNavigation);
    document.getElementById("filterTerms").onsearch = filterNavigation;
    $("#reset").on("click", reset);
  }

  function reset(){
    timer.clear();
    p.clear();
    return false;
  }

  function closeNav(){
    $(".nav-open").addClass("termnav");
    $(".nav-open").removeClass("nav-open");
  }

  function createNaviagtion(data){

    $("nav a").bind("click", closeNav);
    $("#main").bind("click", closeNav);
    $("header").bind("click", closeNav);
    $(".navbar").bind("click", closeNav);
  }



  function showNav(){
    $("nav.termnav").addClass("nav-open");
    $("nav.termnav").removeClass("termnav");
    $(".nav-open a").bind("click", closeNav);
    return false;
  }

});
