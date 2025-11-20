import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    const response: any = {
      status: 'error',
      message: err.message,
    };

    if (err.code) {
      response.code = err.code;
    }

    return res.status(err.statusCode).json(response);
  }

  // Log unexpected errors
  console.error('💥 Unexpected error:', err);

  // Send generic error response
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
};