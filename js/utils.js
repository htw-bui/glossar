define(function(){
  Array.prototype.popRandomElement = function () {
    return this.splice(Math.floor(Math.random() * this.length), 1)[0];
  };

  Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  Array.prototype.shuffle = function() {
    var i = this.length, j, temp;
    if ( i === 0 ){
      return this;
    }
    while ( --i ) {
      j = Math.floor( Math.random() * ( i + 1 ) );
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
    return this;
  };

  Array.prototype.remove = function(element){
    this.splice(this.indexOf(element), 1);
    return this;
  };
});
