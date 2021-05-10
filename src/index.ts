import * as express from 'express';
import {Response} from 'express';
import * as logger from 'local-logger';

export const logError = (
  err: Error | string | {message: string; params: (string | number)[]}
) => {
  logger.logError(err);
};

export const logInfo = (
  err: Error | string | {message: string; params: (string | number)[]}
) => {
  logger.logInfo(err);
};

export const addToken: (url: string, res: Response) => string = logger.addToken;

export const startTransaction = (params: {
  name: string;
  type?: string;
  subtype?: string;
  action?: string;
  options?: {
    startTime?: number;
    childOf?: string;
  };
}): ((success: boolean, message?: {}) => void) => {
  return logger.startTransaction(params);
};

export const startSpan = (params: {
  name: string;
  type?: string;
  subtype?: string;
  action?: string;
  options?: {childOf?: string};
}): ((success: boolean, message?: {}) => void) => {
  return logger.startSpan(params);
};

// start express service
const app = express();
export const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(logger.tokenRoute);
app.use(logger.logRoute);

app.get('/ping', (req, res) => {
  res.status(200).json({message: 'pong'});
});

export const server = app.listen(port, () => {
  logger.logInfo({message: 'Service Start', port});
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
  app.use(logger.logRouteError);
};

export const api = app;
