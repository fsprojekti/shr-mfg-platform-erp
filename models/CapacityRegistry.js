const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

const CapacityRegistry = Schema("CapacityRegistry", {
    address: {type: String, required: true},
    providers: {type: Array, default: []},
    consumers: {type: Array, default: []},
})

module.exports = CapacityRegistry;


