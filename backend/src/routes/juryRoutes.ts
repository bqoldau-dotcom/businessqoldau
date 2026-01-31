import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { uploadJuryPhoto } from '../services/fileUploadService';
import * as juryController from '../controllers/juryController';

const router = Router();

// Публичные маршруты
// GET /api/jury - получить активных членов жюри
router.get('/', juryController.getActiveJuryMembers);

// Admin маршруты
// GET /api/jury/admin/all - получить всех членов жюри
router.get('/admin/all', authenticate, adminAuth, juryController.getAllJuryMembers);

// GET /api/jury/admin/:id - получить члена жюри по ID
router.get('/admin/:id', authenticate, adminAuth, juryController.getJuryMemberById);

// POST /api/jury/admin - создать члена жюри
router.post('/admin', authenticate, adminAuth, juryController.createJuryMember);

// PUT /api/jury/admin/order - обновить порядок (должен быть до /:id)
router.put('/admin/order', authenticate, adminAuth, juryController.updateJuryOrder);

// PUT /api/jury/admin/:id - обновить члена жюри
router.put('/admin/:id', authenticate, adminAuth, juryController.updateJuryMember);

// DELETE /api/jury/admin/:id - удалить члена жюри
router.delete('/admin/:id', authenticate, adminAuth, juryController.deleteJuryMember);

// POST /api/jury/admin/:id/photo - загрузить фото
router.post('/admin/:id/photo', authenticate, adminAuth, uploadJuryPhoto, juryController.updateJuryPhoto);

export default router;
