import * as express from 'express';
import * as APM from 'elastic-apm-node';

// start logging service
const apm = APM.start();

export const logError = (
  err: Error | string | {message: string; params: (string | number)[]},
  options?: object
) => {
  apm.captureError(err, options);
};

export const startTransaction = (
  name: string | null | undefined,
  options?:
    | {
        startTime?: number;
        childOf?: string;
      }
    | undefined
): {name: string; result: string | number; end: () => void} | null => {
  return apm.startTransaction(name, options);
};

export const currentTraceparent = apm.currentTraceparent;

export const startSpan = (
  name: string | null | undefined,
  options?: {childOf?: string} | undefined
): {end: () => void} | null => {
  return apm.startSpan(name, options);
};

// start express service
const app = express();
const port = process.env.PORT || 3000;

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
  res.status(200).send('pong');
});

export const server = app.listen(port, () => {
  console.log('Server started on port: ' + port);
});

export const catchAll = (): void => {
  app.all('*', (req, res) => {
    res.status(404).json({message: 'Not found.'});
  });
};

export const api = app;
