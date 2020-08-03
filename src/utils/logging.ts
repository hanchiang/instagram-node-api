import bunyan from 'bunyan';
const bunyanExpressSerializer = require('bunyan-express-serializer');

const logger = bunyan.createLogger({
  name: 'instagram-api',
  serializers: {
    err: bunyanExpressSerializer,
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
  },
  level: 'info',
});

// Disable logging when running tests
if (process.env.NODE_ENV === 'test') {
  logger.level(bunyan.FATAL + 1);
}

export { logger };
