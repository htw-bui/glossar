Array.prototype.popRandomElement = function () {
  return this.splice(Math.floor(Math.random() * this.length), 1)[0];
};

Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)];
};
