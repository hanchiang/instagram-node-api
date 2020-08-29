import { ApiResponse } from 'apisauce';

import { CustomError, ThrowError } from '../types/error';
import { logger } from '../utils/logging';

export enum ErrorStatus {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

const statusToErrorCode = {
  400: 'badRequest',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  500: 'internalServerError',
};

export const mapStatusToErrorCode = (status: number): string =>
  statusToErrorCode[status] || statusToErrorCode[500];

export const throwError = (errObj: ThrowError): void => {
  const error: CustomError = new Error(errObj.message);
  error.status = errObj.status as number;
  error.code = mapStatusToErrorCode(errObj.status as number);
  throw error;
};

export const transformApiError = (
  err: ApiResponse<any>,
  customErrMessage?: string
): CustomError => {
  const { data: message, status, problem, config } = err;

  const error: CustomError = new Error(customErrMessage || message);
  error.code = mapStatusToErrorCode(status);
  error.status = status;
  logger.error(err);

  if (status === 429) {
    logger.error('Rate limited!', message);
  }

  return error;
};
