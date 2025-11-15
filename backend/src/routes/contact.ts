import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * POST /api/contacts
 * Create a new contact message (public)
 */
router.post('/', contactController.createContact);

/**
 * GET /api/contacts
 * Get all contacts (admin only - to be implemented)
 */
router.get('/', authenticate, contactController.getAllContacts);

/**
 * GET /api/contacts/:id
 * Get contact by ID (admin only - to be implemented)
 */
router.get('/:id', authenticate, contactController.getContactById);

export default router;