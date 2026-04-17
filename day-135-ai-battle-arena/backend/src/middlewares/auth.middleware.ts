import {type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No auth token provided' });
      return;
    }

    const token = authHeader.split(' ')[1] as string;
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    
    const decoded = jwt.verify(token, secret) as unknown as { userId: string };
    const user = await User.findById(decoded.userId).select('-password_hash');
    
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token or user not found' });
      return;
    }

    // @ts-ignore
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid auth token' });
  }
};
