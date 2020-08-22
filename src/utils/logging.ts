import bunyan from 'bunyan';

import config from '../config';
const bunyanExpressSerializer = require('bunyan-express-serializer');

const logger = bunyan.createLogger({
  name: 'instagram-api',
  serializers: {
    err: bunyanExpressSerializer,
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
  },
  level: config.nodeEnv === 'production' ? 'info' : 'debug',
});

// Disable logging when running tests
if (config.nodeEnv === 'test') {
  logger.level(bunyan.FATAL + 1);
}

export { logger };
