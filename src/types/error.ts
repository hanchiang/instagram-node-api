import { ErrorStatus } from '../utils/error';

export interface CustomError extends Error {
  message: string;
  code?: string;
  status?: number;
  stack?: string;
}

export interface ThrowError {
  message: string;
  status?: ErrorStatus;
}
