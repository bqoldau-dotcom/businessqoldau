import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { FileType } from '@prisma/client';
import { deleteFile } from './fileUploadService';

export interface ApplicationFileInput {
  applicationId: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileType?: FileType;
}

export interface ApplicationFileResponse {
  id: string;
  applicationId: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileType: FileType;
  createdAt: Date;
}

/**
 * Create a new application file record
 */
export const createApplicationFile = async (
  input: ApplicationFileInput
): Promise<ApplicationFileResponse> => {
  const { applicationId, filePath, fileName, fileSize, mimeType, fileType } = input;

  // Determine file type if not provided
  const determinedFileType = fileType || (mimeType.startsWith('video/') ? FileType.video : FileType.document);

  const file = await prisma.applicationFile.create({
    data: {
      applicationId,
      filePath,
      fileName,
      fileSize,
      mimeType,
      fileType: determinedFileType,
    },
  });

  return file;
};

/**
 * Get all files for an application
 */
export const getApplicationFiles = async (
  applicationId: string
): Promise<ApplicationFileResponse[]> => {
  const files = await prisma.applicationFile.findMany({
    where: { applicationId },
    orderBy: { createdAt: 'asc' },
  });

  return files;
};

/**
 * Get a specific file by ID
 */
export const getFileById = async (
  fileId: string,
  userId: string
): Promise<ApplicationFileResponse> => {
  const file = await prisma.applicationFile.findUnique({
    where: { id: fileId },
    include: {
      application: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!file) {
    throw new AppError('File not found', 404);
  }

  // Verify ownership
  if (file.application.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  // Remove application from response
  const { application, ...fileData } = file;
  return fileData as ApplicationFileResponse;
};

/**
 * Delete a file (both from database and filesystem)
 */
export const deleteApplicationFile = async (
  fileId: string,
  userId: string
): Promise<void> => {
  // Get file with ownership check
  const file = await prisma.applicationFile.findUnique({
    where: { id: fileId },
    include: {
      application: {
        select: {
          userId: true,
          status: true,
        },
      },
    },
  });

  if (!file) {
    throw new AppError('File not found', 404);
  }

  // Verify ownership
  if (file.application.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  // Check if application is in editable state
  const editableStatuses = ['draft', 'revision', 'withdrawn'];
  if (!editableStatuses.includes(file.application.status)) {
    throw new AppError('Cannot delete files from submitted application', 400);
  }

  // Delete from database
  await prisma.applicationFile.delete({
    where: { id: fileId },
  });

  // Delete from filesystem
  await deleteFile(file.filePath);
};

/**
 * Delete all files for an application (used when deleting application)
 */
export const deleteApplicationFiles = async (applicationId: string): Promise<void> => {
  const files = await prisma.applicationFile.findMany({
    where: { applicationId },
  });

  // Delete from database
  await prisma.applicationFile.deleteMany({
    where: { applicationId },
  });

  // Delete from filesystem
  for (const file of files) {
    await deleteFile(file.filePath);
  }
};

/**
 * Count files for an application
 */
export const countApplicationFiles = async (applicationId: string): Promise<number> => {
  return await prisma.applicationFile.count({
    where: { applicationId },
  });
};

/**
 * Validate file ownership
 */
export const validateFileOwnership = async (
  fileId: string,
  userId: string
): Promise<boolean> => {
  const file = await prisma.applicationFile.findUnique({
    where: { id: fileId },
    include: {
      application: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!file) {
    return false;
  }

  return file.application.userId === userId;
};
