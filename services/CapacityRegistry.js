const CapacityRegistry = require("../models/CapacityRegistry");
const serviceAccount = require("./Account");
const {contractCapacityRegistry} = require("../utils/utils");

exports.get = () => {
    return CapacityRegistry.findOne();
}

exports.Web3getProviders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let addresses = await contractCapacityRegistry.methods.getProvidersAddresses().call();
            //Get all providers from addresses in parallel
            let providers = await Promise.all(addresses.map(async (address) => {
                    return await contractCapacityRegistry.methods.getProviderUrl(address).call();
                }
            ));
            //Return map of addresses and providers
            resolve(addresses.map((address, index) => {
                    return {address: address, url: providers[index]};
                }
            ));
        } catch (e) {
            reject(e);
        }
    })
}

exports.Web3getConsumers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let addresses = await contractCapacityRegistry.methods.getConsumersAddresses().call();
            //Get all providers from addresses in parallel
            let consumers = await Promise.all(addresses.map(async (address) => {
                    return await contractCapacityRegistry.methods.getConsumerUrl(address).call();
                }
            ));
            //Return map of addresses and providers
            resolve(addresses.map((address, index) => {
                    return {address: address, url: consumers[index]};
                }
            ));
        } catch (e) {
            reject(e);
        }
    })
}

exports.Web3addProvider = (ip) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = serviceAccount.get();
            //If account don't exist reject
            await contractCapacityRegistry.methods.addProvider(ip).send({
                from: account.address,
                gas: 3000000
            });
            resolve({[account.address]: ip});
        } catch (e) {
            reject(e);
        }
    })
}

exports.Web3updateProvider = (ip) => {
    return new Promise(async (resolve, reject) => {
        try {
            let account = serviceAccount.get();
            await contractCapacityRegistry.methods.updateProvider(ip).send({
                from: account.address,
                gasLimit: 100000
            });
            resolve({[account.address]: ip});
        } catch (e) {
            reject(e);
        }
    })
}

exports.load = () => {
    let pool = CapacityRegistry.findOne();
    if (!pool) {
        pool = CapacityRegistry.create({address: contractCapacityRegistry._address});
        pool.save();
    }
    return pool;
}