require('colors');

var express = require('express'),
  api = require('./routes/api'),
  Postman = require('./lib/postman'),
  config = require('./config.json'),
  vendors = require('./vendors');

var postman = new Postman(config.email);

var handler = function(mail) {
  var found = false;
  for (var i = 0; i < config.authorized.length; i++) {
    var sender = mail.from[0].address.toLowerCase();
    var auth = config.authorized[i].toLowerCase();
    if(auth.indexOf('@') === 0 && sender.indexOf(auth) > -1) {
      found = true;
      break;
    } else if(auth == sender) {
      found = true;
      break;
    }
  }

  if(found === true) {
    var data = mail.subject.split(config.split);

    if(data.length >= 2) {
      var service = data[1].trim().toLowerCase();
      var status = data[2] || 'UP';
      var today = new Date();
      var lvl = vendors.lvls[service];
      var stamp = today.getFullYear() + ('0' + (today.getMonth()+1)).slice(-2);


      lvl.get(stamp, function (err, value) {
        value = value || [];
        value.unshift({
          "status": status.trim().toUpperCase(), //UP, ISSUE, DOWN
          "service": service,
          "created_at": data[3] || new Date().getTime(),
          "message": data[0].trim()
        });
        lvl.put(stamp, value, function(err, valuep) {
          if(err) console.log(err);
          console.log(value);
        });
      });
    }
  }
};

postman.start(handler);

var app = express();
app.use('/', express.static(__dirname + '/public'));

app.get('/uptime', api.uptime);
app.get('/events', api.messages);

var port = config.port || 1338;
app.listen(port, function() {
  console.log('Listening on %d'.green, port);
});
