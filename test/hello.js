define([
    'intern!bdd',
    'intern/chai!expect',
    'js/ProgressCounter'
    ], function (bdd, expect, progressCounter) {
        with (bdd){
            describe('demo', function(){ 
                var p;

                beforeEach(function(){
                    p = new progressCounter(12);
                });

                it("should have the term count that is given to it", function(){
                    expect(p.numberOfTerms).to.equal(12);
                });

                it("should count new terms", function(){
                    p.clear();
                    p.registerTerm("a");
                    p.registerTerm("b");
                    p.registerTerm("c");
                    expect(p.numberOfTermsRead()).to.equal(3);
                });

                it("should not count terms that it has already counted", function(){
                    p.clear();
                    p.registerTerm("a");
                    p.registerTerm("b");
                    p.registerTerm("a");
                    expect(p.numberOfTermsRead()).to.equal(2);
                });

                it("should save items in localstorage", function() {
                    // We do not call .clear herer so there are still 2 items left from the previous test
                    // note that this assumes the tests running in this order
                    expect(p.numberOfTermsRead()).to.equal(2);
                });

                it("should be able to clear its cache", function(){
                    //this test needs to run last in order to clear the count
                    p.clear();
                    expect(p.numberOfTermsRead()).to.equal(0);
                });
            });
        }
    });
