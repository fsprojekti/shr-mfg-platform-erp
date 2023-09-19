const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

const Offer = Schema("Offers", {
    //Price of the offer
    price: {type: Number   , required: true},
    //Expiry date of the offer
    expiryDate: {type: Number},
    //states ["RECEIVED", "EXPIRED", "ACCEPTED", "REJECTED"]
    state: {type: String, default: "RECEIVED"},
    //address of offer seller
    addressSeller: {type: String, required: true},
})

module.exports = Offer;


