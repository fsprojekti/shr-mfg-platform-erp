const config = require('./config');
const morgan = require('morgan');

//Establish server
const express = require('express');
const app = express()
const port = config.port;

// Middleware to capture the response body
app.use((req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;

    let chunks = [];

    res.write = (...restArgs) => {
        chunks.push(Buffer.from(restArgs[0]));
        oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
        if (restArgs[0]) {
            chunks.push(Buffer.from(restArgs[0]));
        }
        const body = Buffer.concat(chunks).toString('utf8');
        res.body = body;  // Attaching the response body to the response object

        oldEnd.apply(res, restArgs);
    };

    next();
});

// Define custom morgan tokens
morgan.token('decoded_url', (req, res) => decodeURIComponent(req.originalUrl));
morgan.token('response_body', (req, res) => res.body);

// Use morgan with the custom tokens
app.use(morgan(':method \x1b[36m:decoded_url\x1b[0m :status :response-time ms - Rsp: :response_body'));

const accountRoutes = require('./api/routes/accounts');
const warehouseRoutes = require('./api/routes/warehouse');
const offerRoutes = require('./api/routes/offer');
const capacityPoolRoutes = require('./api/routes/capacityPool');
const capacityRegistryRoutes = require('./api/routes/CapacityRegistry');
const capacityOfferRoutes = require('./api/routes/capacityOffer');

app.use('/account', accountRoutes);
app.use('/warehouse', warehouseRoutes);
app.use('/offer', offerRoutes);
app.use('/capacity/pool', capacityPoolRoutes);
app.use('/capacity/registry', capacityRegistryRoutes);
app.use('/capacity/offer', capacityOfferRoutes);

const serviceAccount = require("./services/Account");
serviceAccount.load();

const serviceWarehouse = require("./services/Warehouse");
serviceWarehouse.load();

const serviceCapacityRegistry = require("./services/CapacityRegistry");
serviceCapacityRegistry.load();

const serviceCapacityPool = require("./services/CapacityPool");
serviceCapacityPool.load();

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

