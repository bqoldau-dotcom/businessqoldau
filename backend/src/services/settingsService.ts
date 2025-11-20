import prisma from '../config/database';

export interface ApplicationPeriodSettings {
  start_date: string;
  end_date: string;
  is_active: boolean;
  message: string;
}

export class SettingsService {
  /**
   * Получить настройки периода подачи заявок
   */
  async getApplicationSettings(): Promise<ApplicationPeriodSettings | null> {
    const setting = await prisma.applicationSettings.findUnique({
      where: { settingKey: 'application_period' }
    });

    return setting ? (setting.settingValue as unknown as ApplicationPeriodSettings) : null;
  }

  /**
   * Обновить настройки периода подачи заявок
   */
  async updateApplicationSettings(
    startDate: string,
    endDate: string,
    adminId: string
  ): Promise<ApplicationPeriodSettings> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const settings: ApplicationPeriodSettings = {
      start_date: startDate,
      end_date: endDate,
      is_active: true,
      message: `Период подачи заявок: ${start.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })} - ${end.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })}`
    };

    await prisma.applicationSettings.upsert({
      where: { settingKey: 'application_period' },
      update: {
        settingValue: settings as any,
        updatedById: adminId,
        updatedAt: new Date()
      },
      create: {
        settingKey: 'application_period',
        settingValue: settings as any,
        updatedById: adminId
      }
    });

    return settings;
  }

  /**
   * Проверить активность периода подачи заявок
   */
  async isApplicationPeriodActive(): Promise<{
    isActive: boolean;
    message?: string;
    settings?: ApplicationPeriodSettings;
  }> {
    const settings = await this.getApplicationSettings();

    if (!settings || !settings.is_active) {
      return {
        isActive: false,
        message: 'Период подачи заявок не установлен'
      };
    }

    const now = new Date();
    const startDate = new Date(settings.start_date);
    const endDate = new Date(settings.end_date);

    if (now < startDate) {
      return {
        isActive: false,
        message: `Период подачи заявок начнется ${startDate.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}`,
        settings
      };
    }

    if (now > endDate) {
      return {
        isActive: false,
        message: `Период подачи заявок завершился ${endDate.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}`,
        settings
      };
    }

    return {
      isActive: true,
      settings
    };
  }
}
