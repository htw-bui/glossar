var linkCount;
var casper = require('casper').create();


casper.start("http://localhost:8000#Modell", function() {
		this.echo("Started up");
		var categories = [];
		linkCount = this.getElementsInfo("nav ul li").length;
		});

casper.then(function(){
		for(var i=1; i<linkCount; i++){
		this.thenClick("nav ul li:nth-child(" + i +") a").then(function() {
			console.log('clicked ok, new location is ' + this.getCurrentUrl());
			if (this.exists("#main p")){
				console.log(this.getElementsInfo("#main p")[0]["html"] !== "");
			}
			else {
			 console.log("NOTHING THERE");
}
		this.capture("screen" + Math.random() + ".png");
			});
}
		});



casper.then(function(){
		console.log('clicked ok, new location is ' + this.getCurrentUrl());
		console.log(this.getElementsInfo("#main p")[0]["html"] !== "");
		this.capture("screen.png");
		});


casper.run();


