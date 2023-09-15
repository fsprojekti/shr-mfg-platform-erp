const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

exports.Warehouse = Schema("Warehouse", {
    idAccount: {type: String, required: true},
    //States ["IDLE", "RECEIVING", "STORING", "DISPATCHING", "SWAPPING"]
    state: {type: String, default: "IDLE"},
    //Locations on the demo map
    location: {type: Number, default: 0},
    //Services in warehouse
    services: {type: Array, default: []},
})