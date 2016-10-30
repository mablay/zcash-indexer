var async = require('async');


var getBlock = function blockByIndex(index) {
  return new Promise(function(resolve, reject){
    Block
      .findOne({height: index})
      .then(function(block){
        if (typeof block !== 'undefined') return block;
        // Block from remote
        console.log('[Sync] Block %d not found, requesting it', index);
        return ZcashExplorer.block(index).then(function(newBlock) {
          newBlock._id = newBlock.height;
          return Block.create(newBlock);
        });
      })
      .then(function(block) {
        resolve(block);
      })
      .catch(function(err) {
        //console.log('[Sync] Check if block %d is cached: err ', err);
        reject(err);
      });
  });
};

var getTx = function transactionByHash(hash) {

};

module.exports.sync = function() {

  var chainHeight = 0;

  // 1. Get current block height
  ZcashExplorer
    .info()
    .then(function(network){
      console.log('[ZcashNetwork] info %s', JSON.stringify(network, null, 4));
      //console.log('[ZcashNetwork] block height %d', network.blockNumber);
      chainHeight = 4;//network.blockNumber;
      async.eachOfSeries(new Array(chainHeight), function iterateBlock(dummy, index, next){
        //console.log('[IterateBlock] index %d', index);
        // check if block exists
        getBlock(index)
          .then(function(block){
            console.log('[Sync] block %s', JSON.stringify(block, null, 4));
            return next();
          })
          .catch(function(err){
            return next(err);
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

