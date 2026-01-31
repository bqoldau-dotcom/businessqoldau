import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { uploadFinalistPhoto } from '../services/fileUploadService';
import * as finalistController from '../controllers/finalistController';

const router = Router();

// Публичные маршруты
// GET /api/finalists - получить активных финалистов
router.get('/', finalistController.getActiveFinalists);

// Admin маршруты
// GET /api/finalists/admin/all - получить всех финалистов
router.get('/admin/all', authenticate, adminAuth, finalistController.getAllFinalists);

// GET /api/finalists/admin/stats - получить статистику
router.get('/admin/stats', authenticate, adminAuth, finalistController.getFinalistStats);

// GET /api/finalists/admin/:id - получить финалиста по ID
router.get('/admin/:id', authenticate, adminAuth, finalistController.getFinalistById);

// POST /api/finalists/admin - создать финалиста
router.post('/admin', authenticate, adminAuth, finalistController.createFinalist);

// PUT /api/finalists/admin/order - обновить порядок (должен быть до /:id)
router.put('/admin/order', authenticate, adminAuth, finalistController.updateFinalistOrder);

// PUT /api/finalists/admin/:id - обновить финалиста
router.put('/admin/:id', authenticate, adminAuth, finalistController.updateFinalist);

// DELETE /api/finalists/admin/:id - удалить финалиста
router.delete('/admin/:id', authenticate, adminAuth, finalistController.deleteFinalist);

// POST /api/finalists/admin/:id/photo - загрузить фото
router.post('/admin/:id/photo', authenticate, adminAuth, uploadFinalistPhoto, finalistController.updateFinalistPhoto);

export default router;
