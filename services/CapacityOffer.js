const CapacityOffer = require("../models/CapacityOffer");

serviceService = require("./Service");

const {contractCapacityRegistry, contractCapacityPool, web3} = require("../utils/utils");
const serviceAccount = require("./Account");
const emitter = require('../utils/events').eventEmitter;

/*
Get offerPool from database

* @param query - query to be used to find offerPool
* @return offerPool - offerPools that were found
 */
exports.get = (query) => {
    return CapacityOffer.find(query);
}

/*
Post offerPool to the capacity pool

* @param offerPool - offerPool to be posted
* @return offerPool - offerPool that was posted
 */
exports.Web3postOffer = (offerPool) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trx = await contractCapacityPool.methods.addOffer(offerPool.id, web3.utils.toWei(offerPool.price, "ether"), offerPool.expiryDate).send({
                    from: serviceAccount.get().address,
                    gas: 3000000
                }
            );
            //Update offer state
            offerPool.state = "POSTED";
            offerPool.save();
            resolve(offerPool);
        } catch (e) {
            reject(e);
        }
    })
}

/*
Update offerPools from the capacity pool

* @return offerPools - offerPools that were updated
 */
exports.Web3updateOffers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let offers = await contractCapacityPool.methods.getOffers().call();
            for (let offer of offers) {
                add(offer);
            }
            resolve(offers);
        } catch (e) {
            reject(e);
        }
    })
}

/*
Accept offer from the capacity pool

* @param offer - offer to be accepted
* @return offer - offer that was accepted

 */
exports.Web3acceptOffer = (offer) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trx = await contractCapacityPool.methods.acceptOffer(offer.id).send({
                    from: serviceAccount.get().address,
                    gas: 3000000
                }
            );
            //Update offer state
            offer.state = "ACCEPTED";
            offer.save();
            resolve(offer);
        } catch (e) {
            reject(e);
        }
    })
}

/*
Set offer to be forwarded to the pool

* @param offer - offer to be forwarded
* @param fee - fee to be paid for the offer
* @param expiryDate - expiry date of the offer
* @return offerPool - offerPool that was created but not posted to the pool
 */
exports.set = (offer, fee, expiryDate) => {
    //Check if fee parameter is defined if not calculate it
    if (!fee) {
        //Set fee to average fee from the last 10 offers that have state ACCEPTED and are of type POOL
        let offers = CapacityOffer.find({
            state: "ACCEPTED",
            type: "POOL"
        }).sort((a, b) => b.count - a.count).slice(0, 10);
        fee = offers.reduce((a, b) => a + b.fee, 0) / offers.length;
        //If zero set it to 1
        if (fee === 0) fee = 1;
    }
    //Check if expiryDate parameter is defined if not calculate it
    if (!expiryDate) {
        //Calculate expiry date by subtracting 1 min from current expiry date
        expiryDate = offer.expiryDate - 60;
    }


    //Update offer state
    return CapacityOffer.create({
        _id: offer._id,
        price: offer.price - fee,
        fee: fee,
        expiryDate: expiryDate,
        //Seller is this account
        addressSeller: serviceAccount.get().address,
    }).save();
}

/*
Add or update offer from pool to local db

* @param offer - offer to be added or updated
 */
let add = (offer) => {
    try {
        //Find matched offer in db
        let _offer = CapacityOffer.findOne({_id: offer.id});
        //If offer not found create it
        if (!_offer) {
            _offer = CapacityOffer.create({
                _id: offer.id,
                price: web3.utils.fromWei(offer.price, "ether"),
                expiryDate: parseInt(offer.expiryTimestamp),
                addressSeller: offer.seller,
                //Translate state from ["0", "1", "2"]->["IDLE", "ACCEPTED", "REMOVED"]
                state: ["POSTED", "ACCEPTED", "REMOVED"][offer.state],
                offerBC: offer
            }).save();
            //Emit event offer new offer fetched from pool if expiry date is less than current date
            if (_offer.expiryDate < Math.floor(new Date() / 1000)) {
                emitter.emit("offerPool", _offer);
            }
        } else {
            //Check if state has changed compared to the one in db
            if (_offer.state !== ["POSTED", "ACCEPTED", "REMOVED"][offer.state]) {
                //Update state
                _offer.state = ["POSTED", "ACCEPTED", "REMOVED"][offer.state];
                _offer.offerBC = offer;
                _offer.save();
                //Trigger event
                emitter.emit("offerPool", _offer);
            }

        }
        return _offer;
    } catch (e) {
        return e;
    }
}

//Subscribe to event offerPool

