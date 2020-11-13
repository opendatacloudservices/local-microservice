import * as express from 'express';
import * as APM from 'elastic-apm-node';

// start logging service
const apm = APM.start({
  active: process.env.NODE_ENV === 'production',
});

/*
 * In case we want to switch from elastic-apm-node to another service in the future.
 * we have a three wrapper functions to trace errors, spans and transactions.
 */

export const logError = (
  err: Error | string | {message: string; params: (string | number)[]},
  options?: object
) => {
  apm.captureError(err, options);
};

export const startTransaction = (params: {
  name: string;
  type?: string;
  subtype?: string;
  action?: string;
  options?: {
    startTime?: number;
    childOf?: string;
  };
}): {end: (result: string) => void; id: () => string} => {
  const transaction = apm.startTransaction(
    params.name,
    params.type || null,
    params.subtype || null,
    params.action || null,
    params.options || undefined
  );
  return {
    id: () => {
      if (transaction) {
        return transaction.traceparent;
      } else {
        return 'unknown';
      }
    },
    end: (result: string) => {
      if (transaction) {
        transaction.result = result;
        transaction.end();
      }
    },
  };
};

export const currentTraceparent = apm.currentTraceparent;

export const startSpan = (params: {
  name: string;
  type?: string;
  subtype?: string;
  action?: string;
  options?: {childOf?: string};
}): {end: () => void} => {
  const span = apm.startSpan(
    params.name,
    params.type || null,
    params.subtype || null,
    params.action || null,
    params.options || undefined
  );
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
export const port = process.env.PORT || 3000;

app.use(apm.middleware.connect());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/ping', (req, res) => {
  res.status(200).json({message: 'pong'});
});

export const server = app.listen(port, () => {
  console.log('Server started on port: ' + port);
});

export const close = (callback: (err: Error | undefined) => void): void => {
  server.close(callback);
};

// call after setting up the routes in the microservice to catch all 404s
export const catchAll = (): void => {
  app.all('*', (req, res) => {
    logError({
      message: '404',
      params: [
        JSON.stringify(req.query.query_string),
        JSON.stringify(req.route.query),
      ],
    });

    res.status(404).json({message: 'Not found.'});
  });
};

export const api = app;
