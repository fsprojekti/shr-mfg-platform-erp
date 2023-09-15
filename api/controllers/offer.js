const serviceOffer = require("../../services/Offer");
const servicePool = require("../../services/CapacityPool");

exports.get = async (req, res, next) => {
    try {
        let offers = serviceOffer.get();
        res.status(200).json(offers);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.receive = async (req, res, next) => {
    try {
        //Check if offer parameter is set
        if (!req.query.offer) return res.status(400).json("Parameter offer not set");
        //JSON parse offer parameter
        let params = JSON.parse(req.query.offer);
        //Check if offer id parameter is set
        if (!params.id) return res.status(400).json("Parameter offer id not set");
        //Check if expiryDate parameter is set
        if (!params.expiryDate) return res.status(400).json("Parameter expiryDate not set");
        //Check expiryDate parameter
        if (params.expiryDate < Date.now()/1000) return res.status(400).json("Parameter expiryDate is in the past");
        //Check price parameter
        if (!params.price) return res.status(400).json("Parameter price not set");
        //Check price parameter
        if (params.price < 0) return res.status(400).json("Parameter price is negative");
        //Check addressSeller parameter
        if (!params.addressSeller) return res.status(400).json("Parameter addressSender not set");
        let offer = serviceOffer.receive(params);
        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.update = async (req, res, next) => {

}

exports.accept = async (req, res, next) => {

}

exports.plan = async (req, res, next) => {
    try {
        let offer = null;
        if (req.query.idOffer) {
            offer = serviceOffer.get({_id: req.query.idOffer})[0];
            //Reject if offer not found
            if (!offer) return res.status(400).json("Offer with id: " + req.query.idOffer + "not found");
        }
        if (!offer){
            //Fetch offers that are of type POOL and expiry date is in the future and sort them by price chose first one
            offer = serviceOffer.get({type: "POOL", expiryDate: {$gt: Date.now()}}).sort((a, b) => a.price - b.price)[0];
        }
        //Check if offer is found
        if (!offer) return res.status(400).json("No offer found");

        //Check if parameter fee is set if not set it to 0
        if (!req.query.fee) req.query.fee = 0;
        offer.fee = req.query.fee;
        offer.save();

        offer = serviceOffer.plan(offer);
        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.post = async (req, res, next) => {
    try {
        //Find offer
        let offer = serviceOffer.get({_id: req.query.idOffer})[0];
        //If offer not fount check for the offers with formulated state sort them by fee and choose first one
        if (!offer) offer = serviceOffer.get({state: "FORMULATED"}).sort((a, b) => b.fee - a.fee)[0];
        //Reject if no offer found
        if (!offer) return res.status(400).json("No offer found that can be set");
        offer = await serviceOffer.Web3postToPool(offer);
        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }

}

exports.accept = async (req, res, next) => {
    //Parse offer parameter from query
    try {
        //Check if offer parameter is set
        if (!req.query.offer) return res.status(400).json("Parameter offer not set");
        //JSON parse offer parameter
        let params = JSON.parse(req.query.offer);
        //Check if offer id parameter is set
        if (!params.id) return res.status(400).json("Parameter offer id not set");
        //Get offer
        let offer = serviceOffer.get({_id: params.id})[0];
        //Reject if offer not found
        if (!offer) return res.status(400).json("Offer with id: " + params.id + "not found");
        //Check expiry date
        if (offer.expiryDate < Date.now()/1000) return res.status(400).json("Offer with id: " + params.id + "is expired");

        offer = await serviceOffer.HttpAccept(offer);

        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.reject = async (req, res, next) => {

}

exports.fetch = async (req, res, next) => {
    try {
        let offers = await serviceOffer.Web3updateFromPool();
        res.status(200).json(offers);
    } catch (e) {
        res.status(400).json(e);
    }

}