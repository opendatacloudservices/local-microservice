"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.catchAll = exports.close = exports.server = exports.port = exports.startSpan = exports.startTransaction = exports.addToken = exports.logInfo = exports.logError = void 0;
const express = require("express");
const logger = require("local-logger");
exports.logError = (err) => {
    logger.logError(err);
};
exports.logInfo = (err) => {
    logger.logInfo(err);
};
exports.addToken = logger.addToken;
exports.startTransaction = (params) => {
    return logger.startTransaction(params);
};
exports.startSpan = (params) => {
    return logger.startSpan(params);
};
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
exports.close = (callback) => {
    exports.server.close(callback);
};
// call after setting up the routes in the microservice to catch all 404s
exports.catchAll = () => {
    app.all('*', (req, res) => {
        exports.logError({
            message: '404',
            params: [
                JSON.stringify(req.query.query_string),
                JSON.stringify(req.route.query),
            ],
        });
        res.status(404).json({ message: 'Not found.' });
    });
    app.use(logger.logRouteError);
};
exports.api = app;
//# sourceMappingURL=index.js.map