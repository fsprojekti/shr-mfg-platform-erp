const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

const Service = Schema("Services", {
    //States ["DEAL", "TRANSPORT_IN", "RECEIVING","ACTIVE","DISPATCHING","TRANSPORT_OUT,"PAID"]
    state: {type: String, default: "DEAL"},
    //States change timestamps
    timestamps: {type: Array, default: []},
    //Offer for this service
    idOffer: {type: String, default: ""},
    //Service storage location
    location: {type: String, default: ""},
})

module.exports = Service;
