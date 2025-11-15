import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApplicationCategory } from '@prisma/client';
import * as applicationService from '../services/applicationService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const createApplicationSchema = z.object({
  category: z.enum(['starter', 'active', 'it'], {
    message: 'Category must be one of: starter, active, it',
  }),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(5000, 'Summary is too long'),
});

const updateApplicationSchema = z.object({
  category: z.enum(['starter', 'active', 'it'], {
    message: 'Category must be one of: starter, active, it',
  }).optional(),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(5000, 'Summary is too long').optional(),
});

/**
 * GET /api/applications
 * Get all applications for the authenticated user
 */
export const getApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const applications = await applicationService.getApplications(req.userId);

    res.json({
      message: 'Applications retrieved successfully',
      applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:id
 * Get a specific application by ID
 */
export const getApplicationById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError('Application ID is required', 400);
    }

    const application = await applicationService.getApplicationById(id, req.userId);

    res.json({
      message: 'Application retrieved successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/applications
 * Create a new application (draft status)
 */
export const createApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const validatedData = createApplicationSchema.parse(req.body);

    const application = await applicationService.createApplication(req.userId, {
      category: validatedData.category as ApplicationCategory,
      summary: validatedData.summary,
    });

    res.status(201).json({
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

/**
 * PUT /api/applications/:id
 * Update an application (only draft status)
 */
export const updateApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError('Application ID is required', 400);
    }

    const validatedData = updateApplicationSchema.parse(req.body);

    // Check if at least one field is provided
    if (Object.keys(validatedData).length === 0) {
      throw new AppError('No fields to update', 400);
    }

    const application = await applicationService.updateApplication(id, req.userId, {
      category: validatedData.category as ApplicationCategory | undefined,
      summary: validatedData.summary,
    });

    res.json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

/**
 * POST /api/applications/:id/submit
 * Submit an application (draft -> submitted)
 */
export const submitApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError('Application ID is required', 400);
    }

    const application = await applicationService.submitApplication(id, req.userId);

    res.json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/applications/:id
 * Delete an application (only draft status)
 */
export const deleteApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError('Application ID is required', 400);
    }

    await applicationService.deleteApplication(id, req.userId);

    res.json({
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/applications/:id/upload
 * Upload business plan file for an application
 */
export const uploadBusinessPlan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id } = req.params;

    if (!id) {
      throw new AppError('Application ID is required', 400);
    }

    // Check if file was uploaded
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    // Get relative path for storage
    const filePath = req.file.path.replace(/\\/g, '/');

    // Update application with file path
    const application = await applicationService.updateApplication(id, req.userId, {
      planFilePath: filePath,
    });

    res.json({
      message: 'Business plan uploaded successfully',
      application,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    next(error);
  }
};