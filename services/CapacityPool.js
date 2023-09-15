const CapacityPool = require("../models/CapacityPool");
const serviceAccount = require("./Account");
const {contractCapacityRegistry, web3} = require("../utils/utils");

exports.get = () => {
    return CapacityPool.findOne();
}

exports.getRegister = async() => {
    try {
        let account = serviceAccount.get();
        return await contractCapacityRegistry.methods.getProviderUrl(account.address).call();
    } catch (e) {
        return null
    }
}

exports.register = async (ip) => {
    try {
        let account = serviceAccount.get();
        await contractCapacityRegistry.methods.addProvider(ip).send({
            from: account.address
        });
    } catch (e) {
        return null;
    }
}

exports.updateRegister = async (ip) => {
    try {
        let account = serviceAccount.get();
        await contractCapacityRegistry.methods.updateProvider(ip).send({
            from: account.address,
            gasLimit: 100000
        });
        return true;
    } catch (e) {
        return e;
    }
}

exports.load = () => {
    let pool = CapacityPool.findOne();
    if (!pool) {
        pool = CapacityPool.create({address: utils.contractCapacityPool._address});
        pool.save();
    }
    return pool;
}