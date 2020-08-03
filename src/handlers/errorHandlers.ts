/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logging';
import { CustomError } from '../types/error';

export const catchErrors = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fn(req, res, next).catch(next);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err: CustomError = new Error(`${req.path} can't be found`);
  err.status = 404;
  next(err);
};

export const productionErrors = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'An error ocurred';
  const error: any = {
    message: err.message || message,
  };
  if (process.env.NODE_ENV !== 'production') {
    error.stack = err.stack;
  }
  logger.error(error);
  res.status(status).json(error);
};
