import { Request, Response } from 'express';
import { FinalistService } from '../services/finalistService';
import { z } from 'zod';
import { ApplicationCategory } from '@prisma/client';

const finalistService = new FinalistService();

// Схемы валидации
const categoryEnum = z.enum(['starter', 'active', 'it']);

const createFinalistSchema = z.object({
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа').max(200),
  projectName: z.string().min(2, 'Название проекта должно содержать минимум 2 символа').max(300),
  category: categoryEnum,
  city: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  place: z.number().int().min(1).max(10).optional().nullable(),
  isWinner: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

const updateFinalistSchema = z.object({
  fullName: z.string().min(2).max(200).optional(),
  projectName: z.string().min(2).max(300).optional(),
  category: categoryEnum.optional(),
  city: z.string().max(100).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  place: z.number().int().min(1).max(10).optional().nullable(),
  isWinner: z.boolean().optional(),
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
 * GET /api/finalists
 * Получить всех активных финалистов (публичный)
 */
export const getActiveFinalists = async (req: Request, res: Response) => {
  try {
    const { category, isWinner } = req.query;

    const filters: { category?: ApplicationCategory; isWinner?: boolean } = {};
    if (category && ['starter', 'active', 'it'].includes(category as string)) {
      filters.category = category as ApplicationCategory;
    }
    if (isWinner !== undefined) {
      filters.isWinner = isWinner === 'true';
    }

    const finalists = await finalistService.getActiveFinalists(filters);

    res.json({
      success: true,
      data: finalists
    });
  } catch (error) {
    console.error('Error getting active finalists:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения финалистов'
    });
  }
};

/**
 * GET /api/admin/finalists
 * Получить всех финалистов (admin)
 */
export const getAllFinalists = async (req: Request, res: Response) => {
  try {
    const { category, isWinner, isActive } = req.query;

    const filters: { category?: ApplicationCategory; isWinner?: boolean; isActive?: boolean } = {};
    if (category && ['starter', 'active', 'it'].includes(category as string)) {
      filters.category = category as ApplicationCategory;
    }
    if (isWinner !== undefined) {
      filters.isWinner = isWinner === 'true';
    }
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    const finalists = await finalistService.getAllFinalists(filters);

    res.json({
      success: true,
      data: finalists
    });
  } catch (error) {
    console.error('Error getting all finalists:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения финалистов'
    });
  }
};

/**
 * GET /api/admin/finalists/stats
 * Получить статистику финалистов (admin)
 */
export const getFinalistStats = async (req: Request, res: Response) => {
  try {
    const stats = await finalistService.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting finalist stats:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения статистики'
    });
  }
};

/**
 * GET /api/admin/finalists/:id
 * Получить финалиста по ID (admin)
 */
export const getFinalistById = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const finalist = await finalistService.getFinalistById(id);

    if (!finalist) {
      return res.status(404).json({
        success: false,
        message: 'Финалист не найден'
      });
    }

    return res.json({
      success: true,
      data: finalist
    });
  } catch (error) {
    console.error('Error getting finalist:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения финалиста'
    });
  }
};

/**
 * POST /api/admin/finalists
 * Создать нового финалиста (admin)
 */
export const createFinalist = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = createFinalistSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    const finalist = await finalistService.createFinalist(validationResult.data);

    return res.status(201).json({
      success: true,
      data: finalist,
      message: 'Финалист успешно создан'
    });
  } catch (error) {
    console.error('Error creating finalist:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка создания финалиста'
    });
  }
};

/**
 * PUT /api/admin/finalists/:id
 * Обновить финалиста (admin)
 */
export const updateFinalist = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const validationResult = updateFinalistSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    // Проверяем существование
    const existing = await finalistService.getFinalistById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Финалист не найден'
      });
    }

    const finalist = await finalistService.updateFinalist(id, validationResult.data);

    return res.json({
      success: true,
      data: finalist,
      message: 'Финалист успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating finalist:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления финалиста'
    });
  }
};

/**
 * DELETE /api/admin/finalists/:id
 * Удалить финалиста (admin)
 */
export const deleteFinalist = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;

    // Проверяем существование
    const existing = await finalistService.getFinalistById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Финалист не найден'
      });
    }

    await finalistService.deleteFinalist(id);

    return res.json({
      success: true,
      message: 'Финалист успешно удален'
    });
  } catch (error) {
    console.error('Error deleting finalist:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка удаления финалиста'
    });
  }
};

/**
 * PUT /api/admin/finalists/order
 * Обновить порядок отображения (admin)
 */
export const updateFinalistOrder = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = updateOrderSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    await finalistService.updateOrder(validationResult.data);

    return res.json({
      success: true,
      message: 'Порядок успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating finalist order:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления порядка'
    });
  }
};

/**
 * POST /api/admin/finalists/:id/photo
 * Обновить фото финалиста (admin)
 */
export const updateFinalistPhoto = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен'
      });
    }

    // Проверяем существование
    const existing = await finalistService.getFinalistById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Финалист не найден'
      });
    }

    const photoPath = `uploads/finalists/${file.filename}`;
    const finalist = await finalistService.updateFinalist(id, { photoPath });

    return res.json({
      success: true,
      data: finalist,
      message: 'Фото успешно загружено'
    });
  } catch (error) {
    console.error('Error uploading finalist photo:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка загрузки фото'
    });
  }
};
