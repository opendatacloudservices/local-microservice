"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.catchAll = exports.server = exports.startSpan = exports.currentTraceparent = exports.startTransaction = exports.logError = void 0;
const express = require("express");
const APM = require("elastic-apm-node");
// start logging service
const apm = APM.start();
exports.logError = (err, options) => {
    apm.captureError(err, options);
};
exports.startTransaction = (name, options) => {
    return apm.startTransaction(name, options);
};
exports.currentTraceparent = apm.currentTraceparent;
exports.startSpan = (name, options) => {
    return apm.startSpan(name, options);
};
// start express service
const app = express();
const port = process.env.PORT || 3000;
app.use(apm.middleware.connect());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/ping', (req, res) => {
    res.status(200).send('pong');
});
exports.server = app.listen(port, () => {
    console.log('Server started on port: ' + port);
});
exports.catchAll = () => {
    app.all('*', (req, res) => {
        res.status(404).json({ message: 'Not found.' });
    });
};
exports.api = app;
//# sourceMappingURL=index.js.map