import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import * as newsController from '../controllers/newsController';

const router = Router();

// Публичные маршруты
// GET /api/news - получить активные новости
router.get('/', newsController.getActiveNews);

// Admin маршруты
// GET /api/news/admin/all - получить все новости
router.get('/admin/all', authenticate, adminAuth, newsController.getAllNews);

// GET /api/news/admin/:id - получить новость по ID
router.get('/admin/:id', authenticate, adminAuth, newsController.getNewsById);

// POST /api/news/admin - создать новость
router.post('/admin', authenticate, adminAuth, newsController.createNews);

// PUT /api/news/admin/order - обновить порядок (должен быть до /:id)
router.put('/admin/order', authenticate, adminAuth, newsController.updateNewsOrder);

// PUT /api/news/admin/:id - обновить новость
router.put('/admin/:id', authenticate, adminAuth, newsController.updateNews);

// DELETE /api/news/admin/:id - удалить новость
router.delete('/admin/:id', authenticate, adminAuth, newsController.deleteNews);

export default router;
