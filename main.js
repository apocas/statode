require('colors');

var express = require('express'),
  api = require('./routes/api'),
  bodyParser = require('body-parser'),
  Postman = require('./lib/postman'),
  config = require('./config.json'),
  vendors = require('./vendors');

var postman = new Postman(config.email);

var handler = function(mail) {
  if(mail.from[0].address.indexOf('@' + config.authorized) > -1) {

    var data = mail.subject.split(config.split);

    if(data.length >= 2) {
      var service = data[1].trim();
      var status = data[2] || 'UP';
      var today = new Date();
      var lvl = vendors.lvls[service];
      var stamp = today.getFullYear() + ('0' + (today.getMonth()+1)).slice(-2);


      lvl.get(stamp, function (err, value) {
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
app.use(bodyParser());
app.use('/', express.static(__dirname + '/public'));

app.get('/uptime', api.uptime);
app.get('/events', api.messages);

var port = process.env.STATODE_PORT || 1338;
app.listen(port, function() {
  console.log('Listening on %d'.green, port);
});
