import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settingsService';

const settingsService = new SettingsService();

/**
 * Middleware для проверки периода подачи заявок
 * Используется на эндпоинтах, требующих активного периода подачи
 */
export const checkApplicationPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const periodStatus = await settingsService.isApplicationPeriodActive();

    if (!periodStatus.isActive) {
      res.status(403).json({
        success: false,
        message: periodStatus.message || 'Период подачи заявок неактивен',
        periodStatus,
        code: 'APPLICATION_PERIOD_INACTIVE'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error checking application period:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке периода подачи заявок'
    });
  }
};

/**
 * Middleware для проверки периода на auth endpoints (register/login)
 * Блокирует ТОЛЬКО регистрацию вне активного периода
 * Вход (login) разрешен всегда для администраторов
 */
export const checkApplicationPeriodForAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const periodStatus = await settingsService.isApplicationPeriodActive();
    const isRegister = req.path.includes('register');

    // Блокируем только регистрацию, вход разрешен всегда (для администраторов)
    if (!periodStatus.isActive && isRegister) {
      res.status(403).json({
        success: false,
        message: `Регистрация временно недоступна. ${periodStatus.message || ''}`,
        periodStatus,
        code: 'APPLICATION_PERIOD_INACTIVE'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Error checking application period for auth:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке периода подачи заявок'
    });
  }
};
