const express = require('express');
const morgan = require('morgan');
const addRequestId = require('express-request-id')();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const requestIp = require('request-ip');

const errorHandlers = require('./handlers/errorHandlers');
const routes = require('./routes');
const { logger } = require('./utils/logging');

const app = express();
const morganFormat = '":id" :client-ip [:date[web]] ":method :url HTTP/:http-version" :status ":referrer" ":user-agent" :response-time ms';

/**
 * Middlewares
 */
app.use(addRequestId);

// request ip can be retrieved via req.clientIp
app.use(requestIp.mw());

morgan.token('id', req => req.id);
morgan.token('client-ip', req => req.clientIp);
app.use(morgan(morganFormat, {
  skip(req, res) {
    return res.statusCode < 400;
  },
  stream: process.stderr
}));

app.use(morgan(morganFormat, {
  skip(req, res) {
    return res.statusCode >= 400;
  },
  stream: process.stdout
}));

app.use(bodyParser.json());


// bunyan request log
app.use((req, res, next) => {
  const log = logger.child({
    id: req.id,
    body: req.body
  });
  log.info({ req }, 'request');
  next();
});

// bunyan response log
app.use((req, res, next) => {
  function afterResponse() {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
    const log = logger.child({
      id: req.id
    }, true);
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
  res.send('Hello Docker World\n');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('');
});

app.use(routes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.productionErrors);


module.exports = app;
