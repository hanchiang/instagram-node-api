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

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: any = {
    message: err.message || 'An error ocurred',
    status: err.status || 500,
    code: err.code,
    stack: err.stack,
  };
  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
  }
  logger.error(error);
  res.status(error.status).json({ error });
};
