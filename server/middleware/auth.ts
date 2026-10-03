import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { UserModel } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to proceed.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication token missing.',
      });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };
    const user = UserModel.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'User account not found or has been deactivated.',
      });
      return;
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: (user.role as 'user' | 'admin') || 'user',
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please log in again.',
    });
  }
};

export const requireAuth = authenticate;

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Access denied: Administrator privileges required.',
    });
    return;
  }

  next();
};
