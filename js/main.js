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




require(["hyphenate", "ProgressCounter", 'jquery', 'stopwatch'], function(hyphenate, progressCounter, $, stopwatch){
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
    $("<p>", {html: termObject.description}).appendTo("#main");
    Hyphenator.run();
  }

  function setActiveItemInNavigation(){
    var position = n.selectedIndex;
    $("nav ul a").each( function () {
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

  window.addEventListener("hashchange", loadNewDefintition, false);


  function newTerms(items){
    'use strict';
    var key;
    this.items = items;
    this.keys = [];
    this.selectedIndex = 0;
    for (key in items){
      this.keys.push(key);
    }

    this.selectedTerm = function (){
      return this.keys[this.selected];
    };

    this.nextTerm = function(){
      return this.keys[this.selectedIndex + 1];
    };

    this.prevTerm = function(){
      return this.keys[this.selectedIndex - 1];
    };

    this.getDefinition = function (term){
      var position = this.keys.indexOf(term);
      this.selectedIndex = position;
      setActiveItemInNavigation(term);
      checkPaginationVisibilty();
      $("#nextTerm").attr("href", "#" +this.nextTerm());
      $("#previousTerm").attr("href", "#" +this.prevTerm());
      return this.items[term];
    };

  }


  function initPage() {
    'use strict';
    $.getJSON("./neu_generierte_begriffe.json", function (data) {
      n = new newTerms(data);
      p = new progressCounter(n.keys.length);
      p.onChange = function () {
        $("#progress").text(this.numberOfTermsRead() + "|" + this.numberOfTerms);
      };
      timer = new stopwatch();
      timer.execute = function() {
        $('#time').text(this.formatedTime());
      };
      timer.start();
      createNaviagtion(n.keys);
    }).done(loadNewDefintition);

    $('#showNav').on('click', showNav);
    $('#filterTerms').on('keyup', filterNavigation);
    document.getElementById('filterTerms').onsearch = filterNavigation;
    $('#reset').on('click', reset);
  }

  function reset(){
    timer.clear();
    p.clear();
    return false;
  }

  function createNaviagtion(data){
    $(".navItems").remove();
    var navTerms = [];
    $.each(data, function(key, val ) {
      navTerms.push("<li><a href='#" + val + "'" + " id='navigation" + n.keys.indexOf(val) + "'>" + val + "</a></li>");
    });

    $( "<ul/>", {
      class: "navItems",
      html: navTerms.join("")
    }).appendTo("nav");
    $("nav a").bind("click", closeNav);
    $("#main").bind("click", closeNav);
    $("header").bind("click", closeNav);
  }


  function checkPaginationVisibilty(){
    var positionOfSelectedTerm = n.selectedIndex;
    var numberOfTerms = n.keys.length;
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

  function closeNav(){
    $("nav").removeClass("nav-open");
  }

  function showNav(){
    $("nav").addClass("nav-open");
    $("nav a").bind("click", closeNav);
    return false;
  }

  function filterBySearchTerm(term){
    var searchTerm = $("#filterTerms").val();
    if (term.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1){
      return true;
    }
    return false;
  }

  function filterNavigation(){
    var filteredItems = jQuery.extend([], n.keys);
    filteredItems = filteredItems.filter(filterBySearchTerm);
    createNaviagtion(filteredItems);
    return false;
  }
});
