import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuthRequest } from './auth';

/**
 * Admin authentication middleware
 * Verifies that the authenticated user has admin role
 * Must be used after auth middleware
 */
export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    // Check if user is authenticated (should be set by auth middleware)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - authentication required',
      });
    }

    // Get user from database to check role
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
