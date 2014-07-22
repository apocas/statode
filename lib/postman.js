var Notifier = require('./notifier'),
  levelup = require('levelup'),
  events = require('events'),
  util = require('util');


var Postman = function(options) {
  this.started = false;
  this.options = options;
  this.notifier  = new Notifier(this.options);
};

util.inherits(Postman, events.EventEmitter);

Postman.prototype.start = function(handler) {
  var self = this;

  this.notifier.on('mail', function(mail) {
    handler(mail);
  });

  this.notifier.on('end',function() {
    self.emit('end');
  });

  this.notifier.on('error',function(err) {
    self.emit('error', err);
  });

  this.toggleState();
};

Postman.prototype.toggleState = function() {
  var self = this;

  if(this.started) {
    this.notifier.stop();
  } else {
    this.notifier.start();
  }

  this.started = !this.started;

  setTimeout(function() {
    self.toggleState();
  }, 10000);
};


module.exports = Postman;
