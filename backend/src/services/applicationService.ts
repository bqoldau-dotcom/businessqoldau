import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { ApplicationCategory, ApplicationStatus } from '@prisma/client';
import { deleteApplicationFiles, countApplicationFiles } from './applicationFileService';

export interface ApplicationInput {
  category: ApplicationCategory;
  summary: string;
  planFilePath?: string;
  videoFilePath?: string;
}

export interface ApplicationUpdateInput {
  category?: ApplicationCategory;
  summary?: string;
  planFilePath?: string;
  videoFilePath?: string;
}

export interface ApplicationResponse {
  id: string;
  userId: string;
  category: ApplicationCategory;
  summary: string;
  planFilePath: string | null;
  videoFilePath: string | null;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all applications for a user
 */
export const getApplications = async (userId: string): Promise<ApplicationResponse[]> => {
  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return applications;
};

/**
 * Get a specific application by ID
 */
export const getApplicationById = async (
  id: string,
  userId: string
): Promise<ApplicationResponse> => {
  const application = await prisma.application.findUnique({
    where: { id },
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  // Verify ownership
  if (application.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  return application;
};

/**
 * Create a new application (draft status)
 */
export const createApplication = async (
  userId: string,
  input: ApplicationInput
): Promise<ApplicationResponse> => {
  const { category, summary, planFilePath, videoFilePath } = input;

  // Check if user has profile (required for application)
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError('Profile is required to create an application', 400);
  }

  // Create application with draft status
  const application = await prisma.application.create({
    data: {
      userId,
      category,
      summary,
      planFilePath,
      videoFilePath,
      status: ApplicationStatus.draft,
    },
  });

  return application;
};

/**
 * Update an application (only if status is draft)
 */
export const updateApplication = async (
  id: string,
  userId: string,
  input: ApplicationUpdateInput
): Promise<ApplicationResponse> => {
  // Get existing application
  const existingApplication = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApplication) {
    throw new AppError('Application not found', 404);
  }

  // Verify ownership
  if (existingApplication.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  // Check if application is in editable state (draft, revision, withdrawn)
  const editableStatuses: ApplicationStatus[] = [ApplicationStatus.draft, ApplicationStatus.revision, ApplicationStatus.withdrawn];
  if (!editableStatuses.includes(existingApplication.status)) {
    throw new AppError('Cannot update application with current status', 400);
  }

  // Update application
  const application = await prisma.application.update({
    where: { id },
    data: input,
  });

  return application;
};

/**
 * Submit an application (draft -> submitted)
 */
export const submitApplication = async (
  id: string,
  userId: string
): Promise<ApplicationResponse> => {
  // Get existing application
  const existingApplication = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApplication) {
    throw new AppError('Application not found', 404);
  }

  // Verify ownership
  if (existingApplication.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  // Check if already submitted
  if (existingApplication.status === ApplicationStatus.submitted) {
    throw new AppError('Application already submitted', 400);
  }

  // Validate required fields for submission
  // Check both old planFilePath and new files table
  const filesCount = await countApplicationFiles(id);
  if (!existingApplication.planFilePath && filesCount === 0) {
    throw new AppError('At least one file is required for submission', 400);
  }

  // Update status to submitted
  const application = await prisma.application.update({
    where: { id },
    data: {
      status: ApplicationStatus.submitted,
    },
  });

  return application;
};

/**
 * Get application with files
 */
export const getApplicationWithFiles = async (
  id: string,
  userId: string
): Promise<ApplicationResponse & { files: any[] }> => {
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      files: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  // Verify ownership
  if (application.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  return application;
};

/**
 * Withdraw a submitted application (submitted -> withdrawn)
 */
export const withdrawApplication = async (
  id: string,
  userId: string
): Promise<ApplicationResponse> => {
  // Get existing application
  const existingApplication = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApplication) {
    throw new AppError('Application not found', 404);
  }

  // Verify ownership
  if (existingApplication.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  // Check if application is submitted
  if (existingApplication.status !== ApplicationStatus.submitted) {
    throw new AppError('Only submitted applications can be withdrawn', 400);
  }

  // Update status to withdrawn
  const application = await prisma.application.update({
    where: { id },
    data: {
      status: ApplicationStatus.withdrawn,
    },
  });

  return application;
};

/**
 * Delete an application (only if status is draft)
 */
export const deleteApplication = async (id: string, userId: string): Promise<void> => {
  // Get existing application
  const existingApplication = await prisma.application.findUnique({
    where: { id },
  });

  if (!existingApplication) {
    throw new AppError('Application not found', 404);
  }

  // Verify ownership
  if (existingApplication.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  // Check if application is in editable state (draft, revision, withdrawn)
  const editableStatuses: ApplicationStatus[] = [ApplicationStatus.draft, ApplicationStatus.revision, ApplicationStatus.withdrawn];
  if (!editableStatuses.includes(existingApplication.status)) {
    throw new AppError('Cannot delete application with current status', 400);
  }

  // Delete all associated files first
  await deleteApplicationFiles(id);

  // Delete application
  await prisma.application.delete({
    where: { id },
  });
};