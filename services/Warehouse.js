const {web3, contractCPLToken} = require("../utils/utils");
const secret = require("../secret.json");
const serviceAccount = require("./Account");
const {Warehouse} = require("../models/Warehouse");


exports.get = () => {
    return Warehouse.findOne();
}
//Load warehouse
exports.load = () => {
    //Check if account address is already in database
    let account = serviceAccount.load();
    //Get warehouse
    let warehouse = Warehouse.findOne();
    if (!warehouse) {
        //Create new package
        this.create(account);
    }
    return warehouse;
}

exports.create = (account) => {
    let warehouse = Warehouse.create({idAccount: account._id,}).save();
    //Retrieve  warehouse
    return Warehouse.findOne();
}