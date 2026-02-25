import { Request, Response } from 'express';
import { NewsService } from '../services/newsService';
import { z } from 'zod';

const newsService = new NewsService();

// Схемы валидации
const createNewsSchema = z.object({
  title: z.string().min(2, 'Заголовок должен содержать минимум 2 символа').max(500),
  content: z.string().min(10, 'Содержание должно содержать минимум 10 символов').max(10000),
  publishDate: z.string().datetime().optional(),
  isActive: z.boolean().optional()
});

const updateNewsSchema = z.object({
  title: z.string().min(2).max(500).optional(),
  content: z.string().min(10).max(10000).optional(),
  publishDate: z.string().datetime().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

const updateOrderSchema = z.array(
  z.object({
    id: z.string().uuid(),
    order: z.number().int().min(0)
  })
);

/**
 * GET /api/news
 * Получить все активные новости (публичный)
 */
export const getActiveNews = async (req: Request, res: Response) => {
  try {
    const news = await newsService.getActiveNews();

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error getting active news:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения новостей'
    });
  }
};

/**
 * GET /api/news/admin/all
 * Получить все новости (admin)
 */
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await newsService.getAllNews();

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error getting all news:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения новостей'
    });
  }
};

/**
 * GET /api/news/admin/:id
 * Получить новость по ID (admin)
 */
export const getNewsById = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const article = await newsService.getNewsById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    return res.json({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Error getting news article:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения новости'
    });
  }
};

/**
 * POST /api/news/admin
 * Создать новую новость (admin)
 */
export const createNews = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = createNewsSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    const data: any = {
      title: validationResult.data.title,
      content: validationResult.data.content,
      isActive: validationResult.data.isActive
    };

    if (validationResult.data.publishDate) {
      data.publishDate = new Date(validationResult.data.publishDate);
    }

    const article = await newsService.createNews(data);

    return res.status(201).json({
      success: true,
      data: article,
      message: 'Новость успешно создана'
    });
  } catch (error) {
    console.error('Error creating news:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка создания новости'
    });
  }
};

/**
 * PUT /api/news/admin/:id
 * Обновить новость (admin)
 */
export const updateNews = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const validationResult = updateNewsSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    // Проверяем существование
    const existing = await newsService.getNewsById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    const data: any = { ...validationResult.data };
    if (data.publishDate) {
      data.publishDate = new Date(data.publishDate);
    }

    const article = await newsService.updateNews(id, data);

    return res.json({
      success: true,
      data: article,
      message: 'Новость успешно обновлена'
    });
  } catch (error) {
    console.error('Error updating news:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления новости'
    });
  }
};

/**
 * DELETE /api/news/admin/:id
 * Удалить новость (admin)
 */
export const deleteNews = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;

    // Проверяем существование
    const existing = await newsService.getNewsById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Новость не найдена'
      });
    }

    await newsService.deleteNews(id);

    return res.json({
      success: true,
      message: 'Новость успешно удалена'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка удаления новости'
    });
  }
};

/**
 * PUT /api/news/admin/order
 * Обновить порядок отображения (admin)
 */
export const updateNewsOrder = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = updateOrderSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    await newsService.updateOrder(validationResult.data);

    return res.json({
      success: true,
      message: 'Порядок успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating news order:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления порядка'
    });
  }
};
