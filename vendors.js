var levelup = require('levelup'),
  config = require('./config.json');

var lvlOptions = {
'valueEncoding': 'json'
};

var servicesDB = {};
for (var i = 0; i < config.services.length; i++) {
  servicesDB[config.services[i]] = {};
  servicesDB[config.services[i]] = levelup(__dirname + '/leveldb/' + config.services[i], lvlOptions);
}

module.exports = {'lvls' : servicesDB};
