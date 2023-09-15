const serviceWarehouse = require("../../services/Warehouse");
const serviceOffer = require("./../../services/Offer");

exports.get = (req, res, next) => {
    let warehouse = serviceWarehouse.get();
    //Check if package exists
    if (!warehouse) return res.status(404).json({message: "Warehouse not found"});
    //Return package
    res.status(200).json(warehouse);
}