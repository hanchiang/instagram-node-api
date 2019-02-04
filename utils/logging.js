const bunyan = require('bunyan');
const bunyanExpressSerializer = require('bunyan-express-serializer');

exports.logger = bunyan.createLogger({
  name: 'instagram-api',
  serializers: {
    err: bunyanExpressSerializer,
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res
  },
  level: 'info'
});

exports.logResponse = (id, body) => {
  const log = this.logger.child({
    id,
    body
  }, true);
  log.info('response');
};

// Disable logging when running tests
if (process.env.NODE_ENV === 'test') {
  this.logger.level(bunyan.FATAL + 1);
}
