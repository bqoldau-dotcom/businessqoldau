import { Router } from 'express';
import * as profileController from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

// GET /api/profile - Get current user's profile
router.get('/', profileController.getProfile);

// POST /api/profile - Create profile for current user
router.post('/', profileController.createProfile);

// PUT /api/profile - Update profile for current user
router.put('/', profileController.updateProfile);

export default router;