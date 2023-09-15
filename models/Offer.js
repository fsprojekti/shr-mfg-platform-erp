const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

const Offer = Schema("Offers", {
    price: {type: Number, required: true},
    fee: {type: Number, default: 0},
    expiryDate: {type: Number},
    //states ["IDLE", "FORMULATED", "POSTED", "EXPIRED", "ACCEPTED", "REJECTED"]
    state: {type: String, default: "IDLE"},
    //Type of offer ["DIRECT", "POOL"]
    type: {type: String, default: "DIRECT"},
    //address of offer seller
    addressSeller: {type: String, required: true},
})

module.exports = Offer;


