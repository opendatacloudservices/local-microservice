import * as express from 'express';
import {Response} from 'express';
import * as logger from 'local-logger';

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
    logger.logError({
      message: '404',
      meta: logger.dynamicMeta(req, res),
    });

    res.status(404).json({message: 'Not found.'});
  });
  app.use(logger.logRouteError);
};

export const simpleResponse = (
  responseCode: number,
  responseText: string,
  res: Response,
  trans: (success: boolean, message?: {}) => void
): Response => {
  const message = {message: responseText};
  trans(responseCode >= 200 && responseCode <= 299 ? true : false, message);
  return res.status(responseCode).json(message);
};

export const api = app;
