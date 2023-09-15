const DbLocal = require("db-local");
const config = require("../config.json");
const {Schema} = new DbLocal({path: config.db});

const CapacityPool = Schema("Pools", {
    address: {type: String, required: true},
    offers: {type: Array, default: []},
})

module.exports = CapacityPool;


