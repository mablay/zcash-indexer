# zcash-indexer

Loads zcash block and tx data from [https://explorer.zcha.in] and stores it in a local db.

This project is intended for experimental data exploration on the zcash blockchain.

## Credits

Used application framework [Sails](http://sailsjs.org)
Extra libs: async, request-promise

## Requirements

* NodeJS v5.12+
* npm
* Docker
 
    // I used mongo via docker like that:
    // Replace "/usr/local/var/mongodb/" with your desired mongodb data path
    docker run --name mongo -v /usr/local/var/mongodb/:/data/db -d mongo
    
## First start

    // Make sure to use either sails filedb or have mongo running.
    npm install
    sails console
    // After sails has started into console activate the sync process
    ZcashSync.sync();

## Debugging

    sails console