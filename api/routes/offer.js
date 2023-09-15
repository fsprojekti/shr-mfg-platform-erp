const express = require('express');
const router = express.Router();

const OfferController = require('../controllers/offer');
const PoolController = require("../controllers/capacityPool");

router.get('/get', OfferController.get);

router.get('/new', OfferController.receive);

router.get('/update', OfferController.update);

router.get('/accept', OfferController.accept);

router.get('/reject', OfferController.reject);

router.get('/pool/fetch', OfferController.fetch);

router.get('/pool/plan', OfferController.plan);

router.get('/pool/post', OfferController.post);

module.exports = router;