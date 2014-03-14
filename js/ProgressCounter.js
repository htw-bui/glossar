/*global localStorage: false, define: false */

define(function (){
    return function(numberOfTerms){
        this.numberOfTerms = numberOfTerms;

        var readTerms = JSON.parse(localStorage.getItem("progressCounter.readTerms"));
        if (readTerms === null){
            readTerms = [];
        }

        this.registerTerm = function(term){
            if (readTerms.indexOf(term) === -1){
                readTerms.push(term);
            }
            localStorage.setItem("progressCounter.readTerms", JSON.stringify(readTerms));
            this.onChange();
        };

        this.numberOfTermsRead = function() {
            return readTerms.length;
        };

        this.clear = function() {
            localStorage.removeItem("progressCounter.readTerms");
            readTerms = [];
            this.onChange();
        };

        this.onChange = function(){
            console.log("onChange function of ProgressCounter not overwritten");
        };
    };
});
