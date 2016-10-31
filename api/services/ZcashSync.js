var async = require('async');


var getBlock = function blockByIndex(index) {
  return Block.findOne({height: index}).then(function(block){
    if (typeof block !== 'undefined') return block;
    // Block from remote
    console.log('[Sync] Block %d not found, requesting it', index);
    return ZcashExplorer.block(index).then(function(newBlock) {
      //newBlock._id = newBlock.height;
      return Block.create(newBlock);
    });
  });
};

var getTx = function getTransaction(hash, block) {
  return Transaction.findOne({hash: hash}).then(function (tx) {
    if (typeof tx !== 'undefined') return tx;
    // Tx from remote
    console.log('[getTx] Tx %s not found, requesting it', hash);
    return new Promise(function(resolve, reject){
      ZcashExplorer.transaction(hash).then(function(newTx) {
        newTx.blockId = block;
        Transaction.create(newTx).then(resolve).catch(reject);
      }).catch(function(err){
        //console.log('[getTx] Tx %s missing', hash);
        newTx = {
          blockId: block,
          hash: hash,
          type: 'missing'
        };
        Transaction.create(newTx).then(resolve).catch(reject);
      });
    });
  });
};

var consumeTxs = function consumeTransactions(block) {
  var txs = [];
  return new Promise(function(resolve, reject){
    async.eachOfSeries(block.transactions, function iterateTxs(hash, index, nextTx) {
      getTx(hash, block).then(function(tx) {
        txs.push(tx);
        nextTx();
        return null;
      }).catch(function(err){
        console.log('[consumeTx] Error ', err.statusCode);
        nextTx();
        return null;
      });
    }, function doneTxs(err){
      if (err) return reject(err);
      resolve(txs);
    });
  });
};

module.exports.sync = function() {

  var chainHeight = 0;

  // 1. Get current block height
  ZcashExplorer
    .info()
    .then(function(network){
      console.log('[ZcashNetwork] info %s', JSON.stringify(network, null, 4));
      //console.log('[ZcashNetwork] block height %d', network.blockNumber);
      chainHeight = network.blockNumber;
      async.eachOfSeries(new Array(chainHeight), function iterateBlock(dummy, index, nextBlock){
        //console.log('[IterateBlock] index %d', index);
        // check if block exists
        getBlock(index)
          .then(function(block){
            console.log('[Sync] Got block %d, with %d tx', block.height, block.transactions.length);
            return consumeTxs(block);
          })
          .then(function(txs){
            nextBlock();
            return null;
          })
          .catch(function(err){
            return nextBlock(err);
          });
      }, function doneBlocks(err) {
        if (err) return console.log('[Sync] err ', err);
        console.log('[Sync] done');
      });
      return null;
    });

};

