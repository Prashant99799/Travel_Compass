import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Mock authentication middleware
 * In production, this would validate Clerk tokens
 */
export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  // For demo purposes, accept any request with an Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // In production, verify the token here
    req.userId = (req.body as Record<string, string>)?.userId || 'demo-user-id';
    req.userEmail = (req.body as Record<string, string>)?.userEmail || 'demo@example.com';
  }

  next();
}

/**
 * Require authentication middleware
 */
export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
