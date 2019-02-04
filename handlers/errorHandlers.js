/* eslint-disable no-unused-vars */
const { logger } = require('../utils/logging');

exports.catchErrors = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

exports.notFound = (req, res, next) => {
  const err = new Error(`${req.path} can't be found`);
  err.status = 404;
  next(err);
};

exports.productionErrors = (err, req, res, next) => {
  const error = {
    type: err.name,
    message: err.message
  };
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>');
  }
  logger.error({ err: error });
  res.status(err.status || 500).json({ error });
};
