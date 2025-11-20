import { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as profileService from '../services/profileService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const createProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long'),
  phone: z.string().min(1, 'Phone is required').max(50, 'Phone is too long'),
  city: z.string().min(1, 'City is required').max(100, 'City is too long'),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long').optional(),
  phone: z.string().min(1, 'Phone is required').max(50, 'Phone is too long').optional(),
  city: z.string().min(1, 'City is required').max(100, 'City is too long').optional(),
});

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const profile = await profileService.getProfile(req.userId);

    if (!profile) {
      res.status(404).json({
        message: 'Profile not found',
        profile: null,
      });
      return;
    }

    res.json({
      message: 'Profile retrieved successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

export const createProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const validatedData = createProfileSchema.parse(req.body);
    const profile = await profileService.createProfile(req.userId, validatedData);

    res.status(201).json({
      message: 'Profile created successfully',
      profile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const validatedData = updateProfileSchema.parse(req.body);

    // Check if at least one field is provided
    if (Object.keys(validatedData).length === 0) {
      throw new AppError('No fields to update', 400);
    }

    const profile = await profileService.updateProfile(req.userId, validatedData);

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};