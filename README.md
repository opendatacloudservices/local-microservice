# local-microservice

This is a boilerplate for microservices, it includes a basic express server and application performance monitoring (currently using elastic APM).

## How to use
```
npm install local-microservice --save
```

Define **PORT** AND **ELASTIC_APM_SERVICE_NAME** in the corresponding `.env` file.

```
PORT=3000
ELASTIC_APM_SERVICE_NAME=local-microservice
```

In the service's main file setup express as follows:
```
// make sure you import the microservice after importing environmental variables
import {api, catchAll, startTransaction, startSpan, logError} from 'local-microservice';
api.get('/requesturl', (req, res) => {
  const transaction = startTransaction('something');
  try {
    // do something
    transaction.end('success');
  } catch (e) {
    logError(e);
    transaction.end('error');
  }
};
catchAll();
```
