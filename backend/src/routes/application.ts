import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import * as applicationFileController from '../controllers/applicationFileController';
import { authenticate } from '../middleware/auth';
import { uploadBusinessPlan, uploadMultipleFiles } from '../services/fileUploadService';

const router = Router();

// All application routes require authentication
router.use(authenticate);

// GET /api/applications - Get all applications for current user
router.get('/', applicationController.getApplications);

// POST /api/applications - Create new application (draft)
router.post('/', applicationController.createApplication);

// GET /api/applications/:id - Get specific application
router.get('/:id', applicationController.getApplicationById);

// PUT /api/applications/:id - Update application (only draft)
router.put('/:id', applicationController.updateApplication);

// DELETE /api/applications/:id - Delete application (only draft)
router.delete('/:id', applicationController.deleteApplication);

// POST /api/applications/:id/submit - Submit application (draft -> submitted)
router.post('/:id/submit', applicationController.submitApplication);

// POST /api/applications/:id/withdraw - Withdraw application (submitted -> withdrawn)
router.post('/:id/withdraw', applicationController.withdrawApplication);

// === FILE MANAGEMENT ENDPOINTS (NEW) ===

// POST /api/applications/:id/files/upload - Upload multiple files (up to 10)
router.post('/:id/files/upload', uploadMultipleFiles, applicationFileController.uploadFiles);

// GET /api/applications/:id/files - Get all files for application
router.get('/:id/files', applicationFileController.getFiles);

// DELETE /api/applications/:id/files/:fileId - Delete specific file
router.delete('/:id/files/:fileId', applicationFileController.deleteFile);

// GET /api/applications/:id/files/:fileId/download - Download specific file
router.get('/:id/files/:fileId/download', applicationFileController.downloadFile);

// === LEGACY ENDPOINT (for backward compatibility) ===

// POST /api/applications/:id/upload - Upload business plan file (legacy - single file)
router.post('/:id/upload', uploadBusinessPlan, applicationController.uploadBusinessPlan);

export default router;