const express = require('express');
const router = express.Router();

const WarehouseController = require('../controllers/warehouse');

router.get('/get', WarehouseController.get);

module.exports = router;