import { Router } from 'express';
import * as applicationController from '../controllers/applicationController';
import { authenticate } from '../middleware/auth';
import { uploadBusinessPlan } from '../services/fileUploadService';

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

// POST /api/applications/:id/upload - Upload business plan file
router.post('/:id/upload', uploadBusinessPlan, applicationController.uploadBusinessPlan);

export default router;