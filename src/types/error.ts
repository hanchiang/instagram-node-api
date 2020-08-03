export interface CustomError extends Error {
  status?: number;
  stack?: string;
  type?: string;
}
