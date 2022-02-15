"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.simpleResponse = exports.catchAll = exports.close = exports.server = exports.port = void 0;
const express = require("express");
const logger = require("@opendatacloudservices/local-logger");
// start express service
const app = express();
exports.port = process.env.PORT || 3000;
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(logger.tokenRoute);
app.use(logger.logRoute);
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});
exports.server = app.listen(exports.port, () => {
    logger.logInfo({ message: 'Service Start', port: exports.port });
    console.log('Server started on port: ' + exports.port);
});
const close = (callback) => {
    exports.server.close(callback);
};
exports.close = close;
// call after setting up the routes in the microservice to catch all 404s
const catchAll = () => {
    app.all('*', (req, res) => {
        logger.logError({
            message: '404',
            meta: logger.dynamicMeta(req, res),
        });
        res.status(404).json({ message: 'Not found.' });
    });
    app.use(logger.logRouteError);
};
exports.catchAll = catchAll;
const simpleResponse = (responseCode, responseText, res, trans) => {
    const message = { message: responseText };
    trans(responseCode >= 200 && responseCode <= 299 ? true : false, message);
    return res.status(responseCode).json(message);
};
exports.simpleResponse = simpleResponse;
exports.api = app;
//# sourceMappingURL=index.js.map