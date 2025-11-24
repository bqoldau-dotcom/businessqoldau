import { Response, NextFunction } from 'express';
import * as applicationFileService from '../services/applicationFileService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import path from 'path';

/**
 * POST /api/applications/:id/files/upload
 * Upload multiple files for an application (up to 10)
 */
export const uploadFiles = async (
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

    // Check if files were uploaded
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // Verify application exists and user owns it
    const application = await applicationFileService.getApplicationFiles(id);

    // Check total files count (existing + new)
    const existingFilesCount = application.length;
    const newFilesCount = req.files.length;
    const totalFilesCount = existingFilesCount + newFilesCount;

    if (totalFilesCount > 10) {
      throw new AppError(`Cannot upload ${newFilesCount} files. Maximum 10 files allowed per application. You currently have ${existingFilesCount} files.`, 400);
    }

    // Create file records for each uploaded file
    const uploadedFiles = [];
    for (const file of req.files) {
      const fileRecord = await applicationFileService.createApplicationFile({
        applicationId: id,
        filePath: file.path.replace(/\\/g, '/'),
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      });
      uploadedFiles.push(fileRecord);
    }

    res.json({
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
      totalFiles: totalFilesCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:id/files
 * Get all files for an application
 */
export const getFiles = async (
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

    const files = await applicationFileService.getApplicationFiles(id);

    res.json({
      message: 'Files retrieved successfully',
      files,
      count: files.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/applications/:id/files/:fileId
 * Delete a specific file
 */
export const deleteFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id, fileId } = req.params;

    if (!id || !fileId) {
      throw new AppError('Application ID and File ID are required', 400);
    }

    await applicationFileService.deleteApplicationFile(fileId, req.userId);

    res.json({
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/applications/:id/files/:fileId/download
 * Download a specific file
 */
export const downloadFile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { id, fileId } = req.params;

    if (!id || !fileId) {
      throw new AppError('Application ID and File ID are required', 400);
    }

    const file = await applicationFileService.getFileById(fileId, req.userId);

    // Send file for download
    const fullPath = path.join(process.cwd(), file.filePath);
    res.download(fullPath, file.fileName);
  } catch (error) {
    next(error);
  }
};
