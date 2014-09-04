require('colors');

var config = require('../config.json'),
  vendors = require('../vendors'),
  async = require('async');


exports.uptime = function (req, res) {
  var today = new Date();
  var begin = new Date();
  begin.setMonth(today.getMonth()-1);
  var delta = today.getTime() - begin.getTime();

  var output = {};

  getStatus(function(status) {
    for (var i = 0; i < config.services.length; i++) {
      var online = delta - status[config.services[i]].offline;
      var uptime = (online / delta) * 100;

      output[config.services[i]] = {};
      output[config.services[i]].status = status[config.services[i]].status;
      output[config.services[i]].uptime = uptime;
    }

    res.json(output);
  });

  //setEvents();
};

function getStatus(cb) {
  var output = {};
  getEvents(function(events) {
    for (var i = 0; i < config.services.length; i++) {
      var evs = events[config.services[i].toUpperCase()];
      output[config.services[i]] = {};
      output[config.services[i]].status = 'UP';
      output[config.services[i]].offline = 0;

      if(evs) {
        if(evs.length > 0) {
          output[config.services[i]].status = evs[0].status;
        }
        var date;
        for (var y = evs.length-1; y >= 0; y--) {
          if(evs[y].status == 'DOWN') {
            date = new Date(parseInt(evs[y].created_at)).getTime();
          } else if(date !== undefined) {
            if(evs[y].status == 'UP') {
              var date2 = new Date(parseInt(evs[y].created_at)).getTime();
              output[config.services[i]].offline += (date2 - date);
            }
            date = undefined;
          }
        }
      }
    }
    cb(output);
  });
}

function getEvents(cb) {
  var today = new Date();
  var stamp = today.getFullYear() + ('0' + (today.getMonth())).slice(-2);
  var stamp1 = today.getFullYear() + ('0' + (today.getMonth()+1)).slice(-2);

  async.map(config.services, function(item, callback) {
    var events = [];
    vendors.lvls[item].get(stamp, function (err, value) {
      events = events.concat(value || []);
      vendors.lvls[item].get(stamp1, function (err, value) {
        events = events.concat(value || []);
        callback(undefined, events);
      });
    });
  }, function(err, results) {
    var output = {};
    for (var i = 0; i < config.services.length; i++) {
      var ress = results[i];
      for (var y = 0; y < ress.length; y++) {
        ress[y].created_at = parseInt(ress[y].created_at);
      }
      output[config.services[i].toUpperCase()] = ress;
    }
    cb(output);
  });
}

function setEvents() {
  var today = new Date();
  var stamp = today.getFullYear() + ('0' + (today.getMonth()+1)).slice(-2);

  async.map(config.services, function(item, callback) {
    var ex = [
      {
        "status": "UP",
        "service": item,
        "created_at": today.getTime() + 120000,
        "message": "Testing UP1..."
      },
      {
        "status": "ISSUE",
        "service": item,
        "created_at": today.getTime(),
        "message": "Testing DOWN1..."
      }
    ];

    vendors.lvls[item].put(stamp, ex, function (err, value) {
      callback(err, value);
    });
  }, function(err, results){
    console.log(results);
  });
}

exports.messages = function (req, res) {
  var today = new Date();
  var begin = new Date();
  begin.setMonth(today.getMonth()-1);

  getEvents(function(output) {
    output.max = today.getTime()/1000;
    output.min = begin.getTime()/1000;
    res.json(output);
  });
};
