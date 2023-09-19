const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

const CapacityOffer = Schema("CapacityOffers", {
    //Id of the original offer
    idOffer: {type: String},
    //Price of the offer
    price: {type: Number, required: true},
    //Fee of the offer
    fee: {type: Number, default: 0},
    //Expiry date of the offer
    expiryDate: {type: Number},
    //states ["SET", "POSTED", "EXPIRED", "ACCEPTED", "REMOVED"]
    state: {type: String, default: "SET"},
    //address of offer seller
    addressSeller: {type: String, required: true},
    //address of offer buyer
    addressBuyer: {type: String, default: ""},
    //offer from blockchain smart contract
    offerBC: {type: Object, default: {}},
})

module.exports = CapacityOffer;


