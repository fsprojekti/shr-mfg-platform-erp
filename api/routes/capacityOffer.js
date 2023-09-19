const express = require('express');
const router = express.Router();

const OfferPoolController = require('../controllers/capacityOffer');

router.get('/update', OfferPoolController.update);

router.get('/accept', OfferPoolController.accept);

router.get('/set', OfferPoolController.set);

router.get('/post', OfferPoolController.post);

module.exports = router;