const Offer = require("../models/Offer");

serviceService = require("./Service");

const config = require("../config.json");
const axios = require("axios");
const utils = require("../utils/utils");
const {contractCapacityRegistry, contractCapacityPool, web3} = require("../utils/utils");
const serviceAccount = require("./Account");
const emitter = require('../utils/events').eventEmitter;

exports.get = (query) => {
    return Offer.find(query);
}

exports.HttpAccept = (offer) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Get capacityConsumer
            let consumerUrl = await getCapacityConsumerUrl(offer.addressSeller);
            //If not set reject
            if (!consumerUrl) return reject("Capacity consumer url not found in the registry");

            //Check if expiry date is not expired
            if (offer.expiryDate < Math.floor(new Date() / 1000)) return reject("Offer expired");

            let data = {
                offer: {
                    id: offer._id
                }
            }

            let response = await axios.get(consumerUrl + "/offer/accept", {
                params: data
            });

            //Check if response is OK
            if (response.status !== 200) return reject("Error sending offer");
            //Update offer state
            offer.state = "ACCEPTED";
            offer.save();
            resolve(offer);
        } catch (e) {
            reject(e);
        }
    })
}

exports.HttpReject = (offer) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Get capacityConsumer
            let consumerUrl = await getCapacityConsumerUrl();
            //If not set reject
            if (!consumerUrl) return reject("Capacity consumer url not found in the registry");

            //Check if expiry date is not expired
            if (offer.expiryDate < Math.floor(new Date() / 1000)) return reject("Offer expired");

            let data = {
                offer: {
                    id: offer._id
                }
            }

            let response = await axios.get(consumerUrl + "/offer/reject", {
                params: data
            });

            //Check if response is OK
            if (response.status !== 200) return reject("Error sending offer");
            //Update offer state
            offer.state = "REJECTED";
            offer.save();
            resolve(offer);
        } catch (e) {
            reject(e);
        }
    })
}

exports.Web3postToPool = (offer) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Subtract fee from price
            let pricePosted = offer.price - offer.fee;
            let trx = await contractCapacityPool.methods.addOffer(offer.id, web3.utils.toWei(pricePosted, "ether"), offer.expiryDate).send({
                    from: serviceAccount.get().address,
                    gas: 3000000
                }
            );
            //Update offer state
            offer.state = "POSTED";
            offer.save();
            resolve(offer);
        } catch (e) {
            reject(e);
        }
    })
}

exports.Web3updateFromPool = async () => {
    try {
        let offers = await contractCapacityPool.methods.getOffers().call();
        //Filter out expired offers
        offers = offers.filter(offer => offer.expiryTimestamp > Math.floor(new Date() / 1000));
        offers = offers.map(offer => {
            return {
                id: offer.id,
                price: web3.utils.fromWei(offer.price, "ether"),
                expiryDate: offer.expiryTimestamp,
                addressSeller: offer.seller,
                addressBuyer: offer.buyer,
                //Translate state from ["0", "1", "2"]->["IDLE", "ACCEPTED", "REMOVED"]
                state: ["IDLE", "ACCEPTED", "REMOVED"][offer.state]
            }
        })
        //Update offers in database
        for (let offer of offers) {
            let _offer = Offer.findOne({_id: offer.id});
            if (!_offer) {
                _offer = Offer.create({
                    _id: offer.id,
                    price: offer.price,
                    expiryDate: offer.expiryDate,
                    addressSeller: offer.addressSeller,
                    addressBuyer: offer.addressBuyer,
                    state: offer.state,
                    type: "POOL"
                });
            } else {
                _offer.price = offer.price;
                _offer.expiryDate = offer.expiryDate;
                _offer.addressSeller = offer.addressSeller;
                _offer.addressBuyer = offer.addressBuyer;
                _offer.state = offer.state;
                _offer.type = "POOL";
            }
            _offer.save();
        }

        return offers;
    } catch (e) {
        return e;
    }
}

exports.receive = (offer) => {
    //Check if offer is already in database
    let _offer = Offer.findOne({_id: offer.id});
    if (!_offer) {
        _offer = Offer.create({
            _id: offer.id,
            price: offer.price,
            expiryDate: offer.expiryDate,
            addressSeller: offer.addressSeller,
            addressBuyer: offer.addressBuyer,
            type: "DIRECT"
        });
    } else {
        _offer.price = offer.price;
        _offer.expiryDate = offer.expiryDate;
        _offer.addressSeller = offer.addressSeller;
        _offer.addressBuyer = offer.addressBuyer;
        _offer.type = "DIRECT";
    }
    _offer.save();
    return _offer;
}

exports.plan = (offer) => {
    //Check if fee is set to 0
    if (offer.fee === 0) {
        //Set fee to average fee from the last 10 offers that have state ACCEPTED and are of type POOL
        let offers = Offer.find({state: "ACCEPTED", type: "POOL"}).sort((a, b) => b.count - a.count).slice(0, 10);
        offer.fee = offers.reduce((a, b) => a + b.fee, 0) / offers.length;
        //If zero set it to 1
        if (offer.fee === 0) offer.fee = 1;
    }
    offer.state = "FORMULATED";
    offer.save();

    return offer;
}

let getCapacityConsumerUrl = (address) => {
return new Promise(async (resolve, reject) => {
        try {
            let capacityConsumer = await contractCapacityRegistry.methods.getConsumerUrl(address).call();
            resolve(capacityConsumer);
        } catch (e) {
            reject(e);
        }
    })

}
