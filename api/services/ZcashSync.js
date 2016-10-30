var async = require('async');

module.exports.sync = function() {

  var chainHeight = 0;

  // 1. Get current block height
  ZcashExplorer
    .info()
    .then(function(network){
      console.log('[ZcashNetwork] info %s', JSON.stringify(network, null, 4));
      //console.log('[ZcashNetwork] block height %d', network.blockNumber);
      chainHeight = 3;//network.blockNumber;
      async.eachOfSeries(new Array(chainHeight), function iterateBlock(dummy, index, next){
        //console.log('[IterateBlock] index %d', index);
        // check if block exists
        Block
          .findOne({height: index})
          .then(function(block){
            if (typeof block === 'undefined') {
              console.log('[Sync] Requesting block %d', index);
              ZcashExplorer.blocks(index).then(function(blocks){
                console.log('[API blocks] %s ', JSON.stringify(blocks,null, 4));
                next();
                return null;
              })
            } else {
              console.log('[Sync] Block %d is cached', index);
              next();
              return null;
            }
          })
          .catch(function(err){
            console.log('[Sync] Check if block %d is cached: err ', err);
            next();
            return null;
          });
      }, function done(err) {
        if (err) return console.log('[Sync] err ', err);
        console.log('[Sync] done');
      });
      return null;
    });

  // 2. Iterate blocks 1 .. height

  // 2.1. Skip existing blocks
  // 2.2. Request new blocks and their tx

  // 3. Log "done with block height: N"
  console.log('[ZeroChainSync] done at height %d', chainHeight);
};

