import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler';

// Ensure upload directories exist
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const BUSINESS_PLANS_DIR = path.join(UPLOAD_DIR, 'business-plans');
const TEMPLATES_DIR = path.join(UPLOAD_DIR, 'templates');

// Create directories if they don't exist
if (!fs.existsSync(BUSINESS_PLANS_DIR)) {
  fs.mkdirSync(BUSINESS_PLANS_DIR, { recursive: true });
}

if (!fs.existsSync(TEMPLATES_DIR)) {
  fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
}

// File size limits (from .env or defaults)
const MAX_FILE_SIZE_PDF = parseInt(process.env.MAX_FILE_SIZE_PDF || '20971520'); // 20MB default
const MAX_FILE_SIZE_DOC = parseInt(process.env.MAX_FILE_SIZE_DOC || '20971520'); // 20MB default

// Allowed MIME types for documents
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

// Storage configuration for business plans
const businessPlanStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BUSINESS_PLANS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter for business plans (PDF and DOCS)
const businessPlanFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only PDF, DOC, and DOCX files are allowed', 400));
  }
};

// Multer upload middleware for business plans
export const uploadBusinessPlan = multer({
  storage: businessPlanStorage,
  fileFilter: businessPlanFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_DOC,
  },
}).single('planFile');

// Storage configuration for templates
const templateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMPLATES_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Multer upload middleware for templates
export const uploadTemplate = multer({
  storage: templateStorage,
  fileFilter: businessPlanFileFilter, // Same file types: PDF, DOC, DOCX
  limits: {
    fileSize: MAX_FILE_SIZE_DOC, // 20MB
  },
}).single('file');

/**
 * Delete a file from filesystem
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error - file deletion is not critical
  }
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

/**
 * Validate file type
 */
export const isValidDocumentType = (mimetype: string): boolean => {
  return ALLOWED_DOCUMENT_TYPES.includes(mimetype);
};

/**
 * Format file size to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};