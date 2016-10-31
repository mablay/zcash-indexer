/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
      var sum = txs.reduce(function(sum, tx, index){
        sum += tx.value;
      }, 0.0);
      console.log('[Reward] miner reward %s', sum);
    });
    return null;
  }
};

