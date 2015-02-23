/*jslint browser: true*/
/*global define: false */

var ProgressCounter = function(counterName, numberOfTerms){
  this.numberOfTerms = numberOfTerms;
  var localStorageName = counterName + ".progressCounter.readTerms";

  var readTerms = JSON.parse(localStorage.getItem(localStorageName)) || [];

  this.getReadTerms = function(){
    return readTerms;
  };

  this.registerTerm = function(term){
    if (readTerms.indexOf(term) === -1){
      readTerms.push(term);
    }
    localStorage.setItem(localStorageName, JSON.stringify(readTerms));
  };

  this.numberOfTermsRead = function() {
    return readTerms.length;
  };

  this.clear = function() {
    localStorage.removeItem(localStorageName);
    readTerms = [];
  };
};
