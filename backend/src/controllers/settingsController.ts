import { Request, Response } from 'express';
import { SettingsService } from '../services/settingsService';
import { z } from 'zod';

const settingsService = new SettingsService();

const updateSettingsSchema = z.object({
  start_date: z.string().datetime({ message: 'start_date должна быть в формате ISO 8601' }),
  end_date: z.string().datetime({ message: 'end_date должна быть в формате ISO 8601' })
});

/**
 * GET /api/settings/application-period
 * Получить текущие настройки периода подачи заявок
 */
export const getApplicationSettings = async (req: Request, res: Response) => {
  try {
    const settings = await settingsService.getApplicationSettings();
    const periodStatus = await settingsService.isApplicationPeriodActive();

    res.json({
      success: true,
      data: {
        settings,
        periodStatus
      }
    });
  } catch (error) {
    console.error('Error getting application settings:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения настроек'
    });
  }
};

/**
 * PUT /api/settings/application-period
 * Обновить настройки периода подачи заявок (admin only)
 */
export const updateApplicationSettings = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const validationResult = updateSettingsSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Неверные данные',
        errors: validationResult.error.issues
      });
    }

    const { start_date, end_date } = validationResult.data;
    const adminId = (req as any).userId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Валидация: дата начала должна быть раньше даты окончания
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'Дата начала должна быть раньше даты окончания'
      });
    }

    const settings = await settingsService.updateApplicationSettings(
      start_date,
      end_date,
      adminId
    );

    return res.json({
      success: true,
      data: settings,
      message: 'Настройки периода обновлены'
    });
  } catch (error) {
    console.error('Error updating application settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Ошибка обновления настроек'
    });
  }
};
