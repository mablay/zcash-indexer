/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

module.exports = {

  attributes: {
    blockId: {
      model: 'Block',
      required: true
    }
  },

  reward: function(){
    console.log('[Reward] Calculate ...');
    Transaction.find({type: "minerReward"}).then(function(txs) {
      var wallets = {};
      var sum = txs.reduce(function(sum, tx, index){
        tx.vout.every(function(out){
          var addr = out.scriptPubKey.addresses[0];
          if (wallets[addr])
            wallets[addr] += out.value;
          else
            wallets[addr] = out.value;
        });
        return sum += tx.value;
      }, 0.0);

      //sort walltes
      wallets = _.chain(wallets)
        .map(function(value, key){
          return {
            address: key,
            value: value
          };
        })
        .sortBy('value')
        .reverse()
        .map(function(w){
          var entry = {};
          entry[w.address] = w.value;
          return entry;
        })
        .value();

      console.log('[Reward] wallets %s', JSON.stringify(wallets,null,4));
      console.log('[Reward] miner reward %s', sum);
    });
    return null;
  }
};

