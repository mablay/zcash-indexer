var rp = require('request-promise');

var apiBase = 'https://api.zcha.in/v1/mainnet/';

module.exports = {
  blocks: function(offset, limit) {
    limit = limit || 1;
    var options = {
      url: apiBase + 'blocks?limit='+limit+'&offset='+offset+'&sort=height&direction=ascending',
      json: true
    };
    console.log('[API blocks] requesting %s', options.url);
    return rp(options);
  },
  info: function() {
    var options = {
      url: apiBase + 'network',
      json: true
    };
    return rp(options);
  }
};

