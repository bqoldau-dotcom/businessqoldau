import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { uploadTemplate } from '../services/fileUploadService';
import * as templateController from '../controllers/templateController';

const router = Router();

// Test route - no auth
router.post('/test', (req, res) => {
  console.log('🧪 TEST POST route called!');
  res.json({ message: 'Test POST works!' });
});

// Public/authenticated user routes
router.get('/active', authenticate, templateController.getActiveTemplate);

// Admin routes
router.get('/all', authenticate, adminAuth, templateController.getAllTemplates);

router.delete('/:id', authenticate, adminAuth, templateController.deleteTemplate);

// Upload route - admin only
router.post('/upload', authenticate, adminAuth, uploadTemplate, templateController.uploadTemplateHandler);

export default router;
