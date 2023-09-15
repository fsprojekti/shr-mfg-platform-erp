const serviceCapacityRegistry = require("../../services/CapacityRegistry");
const config = require("../../config.json");

exports.get = (req, res, next) => {
    try {
        let pool = serviceCapacityRegistry.get();
        res.status(200).json(pool);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.load = async (req, res, next) => {
    try {
        let pool = await serviceCapacityRegistry.load();
        res.status(200).json(pool);
    } catch (e) {
        res.status(400).json(e);
    }


}

exports.getProviders = async (req, res, next) => {
    try {
        let entry = await serviceCapacityRegistry.Web3getProviders();
        res.status(200).json(entry);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.getConsumers = async (req, res, next) => {
    try {
        let entry = await serviceCapacityRegistry.Web3getConsumers();
        res.status(200).json(entry);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.registerProviderNew = async (req, res, next) => {
    try {
        //Check for parameter IP if not set it to localhost
        if (!req.query.ip) req.query.ip = "localhost";
        let consumer = await serviceCapacityRegistry.Web3addProvider("http://" + req.query.ip + ":" + config.port);
        res.status(200).json(consumer);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.registerProviderUpdate = async (req, res, next) => {
    try {
        //Check for parameter IP if nto set it to localhost
        if (!req.query.ip) req.query.ip = "localhost";
        let consumer = await serviceCapacityRegistry.Web3updateProvider("http://" + req.query.ip + ":" + config.port);
        res.status(200).json(consumer);
    } catch (e) {
        res.status(400).json(e);
    }

}
