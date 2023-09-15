const express = require('express');
const router = express.Router();

const CapacityRegistryController = require('../controllers/capacityRegistry');

router.get('/get', CapacityRegistryController.get);

router.get('/providers/get', CapacityRegistryController.getProviders);

router.get('/consumers/get', CapacityRegistryController.getConsumers);

router.get('/provider/register/new', CapacityRegistryController.registerProviderNew);

router.get('/provider/register/update', CapacityRegistryController.registerProviderUpdate);

module.exports = router;