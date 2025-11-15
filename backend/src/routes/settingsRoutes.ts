import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

// GET /api/settings/application-period - публичный доступ для проверки периода
router.get('/application-period', settingsController.getApplicationSettings);

// PUT /api/settings/application-period - только для администраторов
router.put(
  '/application-period',
  authenticate,
  adminAuth,
  settingsController.updateApplicationSettings
);

export default router;
