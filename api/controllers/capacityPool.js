const serviceCapacityPool = require("../../services/CapacityPool");;

exports.get = async (req, res, next) => {
    try {
        let pool = await serviceCapacityPool.get();
        res.status(200).json(pool);
    } catch (e) {
        res.status(400).json(e);
    }
}


exports.getOffers = async (req, res, next) => {

}

