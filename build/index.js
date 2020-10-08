"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.catchAll = exports.close = exports.server = exports.startSpan = exports.currentTraceparent = exports.startTransaction = exports.logError = void 0;
const express = require("express");
const APM = require("elastic-apm-node");
// start logging service
const apm = APM.start({
    active: process.env.NODE_ENV === 'production',
});
/*
 * In case we want to switch from elastic-apm-node to another service in the future.
 * we have a three wrapper functions to trace errors, spans and transactions.
 */
exports.logError = (err, options) => {
    apm.captureError(err, options);
};
exports.startTransaction = (params) => {
    const transaction = apm.startTransaction(params.name, params.type || null, params.subtype || null, params.action || null, params.options || undefined);
    return {
        id: () => {
            if (transaction) {
                return transaction.traceparent;
            }
            else {
                return 'unknown';
            }
        },
        end: (result) => {
            if (transaction) {
                transaction.result = result;
                transaction.end();
            }
        },
    };
};
exports.currentTraceparent = apm.currentTraceparent;
exports.startSpan = (params) => {
    const span = apm.startSpan(params.name, params.type || null, params.subtype || null, params.action || null, params.options || undefined);
    return {
        end: () => {
            if (span) {
                span.end();
            }
        },
    };
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
    res.status(200).json({ message: 'pong' });
});
exports.server = app.listen(port, () => {
    console.log('Server started on port: ' + port);
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
};
exports.api = app;
//# sourceMappingURL=index.js.map