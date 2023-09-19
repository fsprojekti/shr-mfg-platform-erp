const serviceCapacityOffer = require("../../services/CapacityOffer");
const serviceOffer = require("../../services/Offer");

exports.get = async (req, res, next) => {
    try {
        let offers = serviceCapacityOffer.get();
        res.status(200).json(offers);
    } catch (e) {
        res.status(400).json(e);
    }
}

/*
API endpoint to update offers from pool and store them in database

Accepts:
    -

Returns:
    offers: array of offer objects
 */
exports.update = async (req, res, next) => {
    try {
        let offers = await serviceCapacityOffer.Web3updateOffers();
        res.status(200).json(offers);
    } catch (e) {
        res.status(400).json(e);
    }
}

/*
API endpoint to accept offer from pool

Accepts:
    idOffer: id of offer to accept

 */
exports.accept = async (req, res, next) => {
    try {
        //Check for parameter idOffer
        if (!req.query.idOffer) return res.status(400).json("Parameter idOffer not set");
        //Update offers
        await serviceCapacityOffer.Web3updateOffers();
        //Find offer
        let offer = serviceCapacityOffer.get({_id: req.query.idOffer})[0];
        //Reject if offer not found
        if (!offer) return res.status(400).json("Offer with id: " + req.query.idOffer + "not found");
        //Check state of offer
        if (offer.state !== "IDLE") return res.status(400).json("Offer with id: " + req.query.idOffer + " is not available. State of offer is: " + offer.state);
        //Check expiryDate parameter
        if (offer.expiryDate < Date.now() / 1000) return res.status(400).json("Offer expired on " + new Date(offer.expiryDate * 1000).toLocaleString());
        //Accept offer
        offer = await serviceCapacityOffer.Web3acceptOffer(offer);
        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }
}

/*
API endpoint to set offer parameters for posting to pool

Accepts:
    idOffer: id of offer to set
    fee: fee to set for offer

Returns:
    offer: offer object

 */
exports.set = async (req, res, next) => {
    try {
        let offer = null;
        if (req.query.idOffer) {
            //Find offer that was sent from warehouse to me and is in state RECEIVED with expiry date in the future
            offer = serviceOffer.get({_id: req.query.idOffer, state: "RECEIVED", expiryDate: {$gt: Date.now()}})[0];
        }
        if (!offer) {
            //Find offer that was sent from warehouse to me and is in state RECEIVED with expiry date in the future
            offer =  serviceOffer.get({state: "RECEIVED", expiryDate: {$gt: Date.now()}})[0];
        }
        //Check if offer is found
        if (!offer) return res.status(400).json("No offer found");

        //Check if parameter fee is set if not set it to 0
        if (!req.query.fee) req.query.fee = 0;
        offer.fee = req.query.fee;
        offer.save();

        offer = serviceCapacityOffer.set(offer);
        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }
}

/*
API endpoint to post offer to pool

Accepts:
    idOffer: id of offer to post

Returns:
    offer: offer object
 */
exports.post = async (req, res, next) => {
    try {
        //Check for parameter idOffer if not set find offer that can be set
        let offer = null;
        if (req.query.idOffer) {
            offer = serviceCapacityOffer.get({_id: req.query.idOffer})[0];
        }else{
            //Fetch offers that are in state SET
            offer = serviceCapacityOffer.get({state: "SET"}).sort((a, b) => b.fee - a.fee)[0];
        }
        //Reject if no offer found
        if (!offer) return res.status(400).json("No offer found that can be set");
        offer = await serviceCapacityOffer.Web3postOffer(offer);
        res.status(200).json(offer);
    } catch (e) {
        res.status(400).json(e);
    }

}