const Offer = require("../models/Offer");
const Service = require("../models/Service");
const serviceOffer = require("../services/Offer");
const axios = require("axios");
const config = require("../config.json");


exports.get = (query) => {
    return Service.find(query);
}

exports.HttpUpdateFromMes = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios.get(config.warehouseMesApi.url + "/warehouse");
            //Check if response data is valid
            if (!response.data) return reject("Response data is not valid");




            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

