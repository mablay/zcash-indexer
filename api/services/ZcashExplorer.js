var rp = require('request-promise');

var apiBase = 'https://api.zcha.in/v1/mainnet/';

module.exports = {
  blocks: function(offset, limit) {
    limit = limit || 20;
    var options = {
      url: apiBase + 'blocks?limit='+limit+'&offset='+offset+'&sort=height&direction=ascending',
      json: true
    };
    //console.log('[API blocks] requesting %s', options.url);
    return rp(options);
  },
  block: function(index) {
    var options = {
      url: apiBase + 'blocks?limit=1&offset='+index+'&sort=height&direction=ascending',
      json: true
    };
    //console.log('[API blocks] requesting %s', options.url);
    return rp(options).then(function(blocks) {
      return blocks[0];
    });
  },
  transaction: function transaction(hash) {
    var options = {
      url: apiBase + 'transactions/'+hash,
      json: true
    };
    //console.log('[API Tx] requesting %s', options.url);
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

