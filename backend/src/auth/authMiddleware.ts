import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Basic ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const [, token] = authHeader.split(' ');
  const decoded = Buffer.from(token, 'base64').toString('utf8');
  const [user, pass] = decoded.split(':');
  if (user === config.username && pass === config.password) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
}
