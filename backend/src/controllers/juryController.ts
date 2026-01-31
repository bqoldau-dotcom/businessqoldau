import { Request, Response } from 'express';
import { JuryService } from '../services/juryService';
import { z } from 'zod';

const juryService = new JuryService();

// Схемы валидации
const createJuryMemberSchema = z.object({
  fullName: z.string().min(2, 'ФИО должно содержать минимум 2 символа').max(200),
  position: z.string().min(2, 'Должность должна содержать минимум 2 символа').max(200),
  organization: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

const updateJuryMemberSchema = z.object({
  fullName: z.string().min(2).max(200).optional(),
  position: z.string().min(2).max(200).optional(),
  organization: z.string().max(200).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
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
 * GET /api/jury
 * Получить всех активных членов жюри (публичный)
 */
export const getActiveJuryMembers = async (req: Request, res: Response) => {
  try {
    const members = await juryService.getActiveJuryMembers();

    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error getting active jury members:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения членов жюри'
    });
  }
};

/**
 * GET /api/admin/jury
 * Получить всех членов жюри (admin)
 */
export const getAllJuryMembers = async (req: Request, res: Response) => {
  try {
    const members = await juryService.getAllJuryMembers();

    res.json({
      success: true,
      data: members
    });
  } catch (error) {
    console.error('Error getting all jury members:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения членов жюри'
    });
  }
};

/**
 * GET /api/admin/jury/:id
 * Получить члена жюри по ID (admin)
 */
export const getJuryMemberById = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const member = await juryService.getJuryMemberById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Член жюри не найден'
      });
    }

    return res.json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Error getting jury member:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка получения члена жюри'
    });
  }
};

/**
 * POST /api/admin/jury
 * Создать нового члена жюри (admin)
 */
export const createJuryMember = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = createJuryMemberSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    const member = await juryService.createJuryMember(validationResult.data);

    return res.status(201).json({
      success: true,
      data: member,
      message: 'Член жюри успешно создан'
    });
  } catch (error) {
    console.error('Error creating jury member:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка создания члена жюри'
    });
  }
};

/**
 * PUT /api/admin/jury/:id
 * Обновить члена жюри (admin)
 */
export const updateJuryMember = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;
    const validationResult = updateJuryMemberSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    // Проверяем существование
    const existing = await juryService.getJuryMemberById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Член жюри не найден'
      });
    }

    const member = await juryService.updateJuryMember(id, validationResult.data);

    return res.json({
      success: true,
      data: member,
      message: 'Член жюри успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating jury member:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления члена жюри'
    });
  }
};

/**
 * DELETE /api/admin/jury/:id
 * Удалить члена жюри (admin)
 */
export const deleteJuryMember = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { id } = req.params;

    // Проверяем существование
    const existing = await juryService.getJuryMemberById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Член жюри не найден'
      });
    }

    await juryService.deleteJuryMember(id);

    return res.json({
      success: true,
      message: 'Член жюри успешно удален'
    });
  } catch (error) {
    console.error('Error deleting jury member:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка удаления члена жюри'
    });
  }
};

/**
 * PUT /api/admin/jury/order
 * Обновить порядок отображения (admin)
 */
export const updateJuryOrder = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = updateOrderSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    await juryService.updateOrder(validationResult.data);

    return res.json({
      success: true,
      message: 'Порядок успешно обновлен'
    });
  } catch (error) {
    console.error('Error updating jury order:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления порядка'
    });
  }
};

/**
 * POST /api/admin/jury/:id/photo
 * Обновить фото члена жюри (admin)
 */
export const updateJuryPhoto = async (req: Request, res: Response): Promise<Response | undefined> => {
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
    const existing = await juryService.getJuryMemberById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Член жюри не найден'
      });
    }

    const photoPath = `uploads/jury/${file.filename}`;
    const member = await juryService.updateJuryMember(id, { photoPath });

    return res.json({
      success: true,
      data: member,
      message: 'Фото успешно загружено'
    });
  } catch (error) {
    console.error('Error uploading jury photo:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка загрузки фото'
    });
  }
};
