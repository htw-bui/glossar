define(function(){
    return function(){
        var self = this;
        var startTime;


        this.start = function(){
            startTime = Date.now();
            setInterval(self.t, 1000);
        };

        this.ellapsed = function(){
            var ellapsed = Date.now() - startTime;
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
        };

    };
});
