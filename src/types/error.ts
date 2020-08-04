export interface CustomError extends Error {
  message: string;
  code?: string;
  status?: number;
  stack?: string;
}
