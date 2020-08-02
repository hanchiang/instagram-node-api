import express from 'express';
import morgan from 'morgan';
import addRequestId from 'express-request-id';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import requestIp from 'request-ip';

import * as errorHandlers from './handlers/errorHandlers';
import routes from './routes';
import { logger } from './utils/logging';

const app = express();

/**
 * Middlewares
 */
// Add id to every request via req.id
app.use(addRequestId());

// request ip can be retrieved via req.clientIp
app.use(requestIp.mw());

if (process.env.NODE_ENV !== 'test') {
  const morganFormat =
    '":id" :client-ip [:date[web]] ":method :url HTTP/:http-version" :status ":referrer" ":user-agent" :response-time ms';
  morgan.token('id', (req: any) => req.id);
  morgan.token('client-ip', (req: any) => req.clientIp);

  app.use(
    morgan(morganFormat, {
      skip(req, res) {
        return res.statusCode < 400;
      },
      stream: process.stderr,
    })
  );

  app.use(
    morgan(morganFormat, {
      skip(req, res) {
        return res.statusCode >= 400;
      },
      stream: process.stdout,
    })
  );
}

app.use(bodyParser.json());

// bunyan request log
app.use((req: any, res, next) => {
  const log = logger.child({
    id: req.id,
    body: req.body,
  });
  log.info({ req }, 'request');
  next();
});

// bunyan response log
app.use((req, res, next) => {
  function afterResponse() {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
    const log = logger.child(
      {
        // @ts-ignore
        id: req.id,
      },
      true
    );
    log.info({ res }, 'response');
  }
  res.on('finish', afterResponse);
  res.on('close', afterResponse);
  next();
});

app.use(helmet());

/**
 * Routes
 */
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/healthz', (req, res) => {
  res.status(200).send();
});

app.use(routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);

export default app;
