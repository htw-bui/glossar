define(function(){
    return function(){
        var self = this;
        var startTime;
        var timeFromtLastRun = JSON.parse(localStorage.getItem(window.location.path  + 'timer.ellapsed'));
        if (timeFromtLastRun === null) {
            timeFromtLastRun = 0;
        }


        this.start = function(){
            startTime = Date.now();
            setInterval(self.t, 1000);
        };

        this.ellapsed = function(){
            var delta = Date.now() - startTime;
            var ellapsed = delta + timeFromtLastRun;
            return ellapsed;
        };

        this.seconds = function(){
            return this.ellapsed() / 1000;
        };

        this.formatedTime = function(){
            var total = this.ellapsed() / 1000;
            var minutes = Math.floor(total/60);
            var seconds = parseInt(total - minutes*60, 10);
            var stringSeconds = seconds.toString();
            if (stringSeconds.length === 1){
                stringSeconds = '0' + stringSeconds;
            }
            return minutes + ":" + stringSeconds;
        };

        this.execute = function(){
            console.log('execute function not implemented');
        };

        this.t = function(){
            self.execute();
            localStorage.setItem(window.location.path  + 'timer.ellapsed', self.ellapsed());
        };

        this.clear = function  () {
            localStorage.removeItem(window.location.path  + 'timer.ellapsed');
            timeFromtLastRun = 0;
            startTime = Date.now();
        };

    };
});