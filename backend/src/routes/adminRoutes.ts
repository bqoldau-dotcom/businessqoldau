import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import * as adminController from '../controllers/adminController';

const router = Router();

// All admin routes require authentication AND admin role
// Apply auth middleware first, then adminAuth middleware

/**
 * GET /api/admin/applications/export
 * Export all applications to Excel
 */
router.get('/applications/export', authenticate, adminAuth, adminController.exportApplicationsHandler);

/**
 * GET /api/admin/applications
 * Get all applications with filters and pagination
 * Query params: status, category, page, limit
 */
router.get('/applications', authenticate, adminAuth, adminController.getApplicationsHandler);

/**
 * PUT /api/admin/applications/:id/status
 * Update application status
 * Body: { status: 'draft' | 'submitted' }
 */
router.put('/applications/:id/status', authenticate, adminAuth, adminController.updateApplicationStatusHandler);

/**
 * GET /api/admin/users/export
 * Export all users to Excel
 */
router.get('/users/export', authenticate, adminAuth, adminController.exportUsersHandler);

/**
 * GET /api/admin/users
 * Get all users with profiles
 * Query params: page, limit, role
 */
router.get('/users', authenticate, adminAuth, adminController.getUsersHandler);

/**
 * GET /api/admin/stats
 * Get application statistics
 */
router.get('/stats', authenticate, adminAuth, adminController.getStatsHandler);

/**
 * GET /api/admin/contacts
 * Get all contacts with pagination
 * Query params: page, limit
 */
router.get('/contacts', authenticate, adminAuth, adminController.getContactsHandler);

/**
 * GET /api/admin/contacts/:id
 * Get contact by ID
 */
router.get('/contacts/:id', authenticate, adminAuth, adminController.getContactHandler);

export default router;
