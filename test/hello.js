define([
    'intern!bdd',
    'intern/chai!expect',
    'js/ProgressCounter',
    'js/stopwatch',
    'test/sinon'
    ], function (bdd, expect, progressCounter, stopwatch, sinon) {
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

            describe('timer', function(){
                var timer;
                var clock;

                before(function(){
                    localStorage.removeItem('timer.ellapsed');
                });

                beforeEach(function(){
                    timer = new stopwatch();
                    clock = sinon.useFakeTimers();
                });

                afterEach(function(){
                    clock.restore();
                });

                it('should be startable', function() {
                    timer.start();
                });

                it('should count the time', function(){
                    timer.start();
                    clock.tick(5000);
                    expect(timer.ellapsed()).to.equal(5000);
                    timer.clear();
                });

                it('should display ellapsed time in seconds', function(){
                    timer.start();
                    clock.tick(5000);
                    expect(timer.seconds()).to.equal(5);
                    timer.clear();
                });

                it('should display ellapsed time formated', function(){
                    timer.start();
                    clock.tick(300001);
                    expect(timer.formatedTime()).to.equal("5:00");
                    // dont't clear here for next test
                });

                it('should save the time', function(){
                    timer.start();
                    // this is supposed to be 300000 since we only save every seconds
                    // that is why we do not get the 300001 from above
                    expect(timer.ellapsed()).to.equal(300000);
                    timer.clear();
                });

            });
        }
    });
