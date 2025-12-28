import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Async handler wrapper to avoid try-catch blocks in controllers
 */
export const asyncHandler = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void | Response>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as T, res, next)).catch(next);
  };
};
