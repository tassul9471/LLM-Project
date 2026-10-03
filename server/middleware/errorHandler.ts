import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled server error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred. Please try again.';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
