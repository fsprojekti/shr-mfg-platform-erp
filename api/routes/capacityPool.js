const express = require('express');
const router = express.Router();

const PoolController = require('../controllers/capacityPool');

router.get('/get', PoolController.get);

router.get('/offer/get', PoolController.getOffers);

module.exports = router;