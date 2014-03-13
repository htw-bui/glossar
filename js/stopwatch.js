define(function(){
    return function(){
        var startTime;
        this.start = function(){
            startTime = Date.now();
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
            var seconds = total - minutes*60;
            var stringSeconds = seconds.toString();
            if (stringSeconds.length === 1){
                stringSeconds = '0' + stringSeconds;
                }
            return minutes + ":" + stringSeconds;
        };

    };
});
