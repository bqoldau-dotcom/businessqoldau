import prisma from '../config/database';
import { Finalist, ApplicationCategory } from '@prisma/client';

export interface CreateFinalistData {
  fullName: string;
  projectName: string;
  category: ApplicationCategory;
  city?: string;
  photoPath?: string;
  description?: string;
  place?: number;
  isWinner?: boolean;
  order?: number;
  isActive?: boolean;
}

export interface UpdateFinalistData {
  fullName?: string;
  projectName?: string;
  category?: ApplicationCategory;
  city?: string;
  photoPath?: string;
  description?: string;
  place?: number;
  isWinner?: boolean;
  order?: number;
  isActive?: boolean;
}

export interface FinalistFilters {
  category?: ApplicationCategory;
  isWinner?: boolean;
  isActive?: boolean;
}

export class FinalistService {
  /**
   * Получить всех активных финалистов (публичный)
   */
  async getActiveFinalists(filters?: FinalistFilters): Promise<Finalist[]> {
    return prisma.finalist.findMany({
      where: {
        isActive: true,
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isWinner !== undefined && { isWinner: filters.isWinner })
      },
      orderBy: [
        { place: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Получить всех финалистов (admin)
   */
  async getAllFinalists(filters?: FinalistFilters): Promise<Finalist[]> {
    return prisma.finalist.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
        ...(filters?.isWinner !== undefined && { isWinner: filters.isWinner }),
        ...(filters?.isActive !== undefined && { isActive: filters.isActive })
      },
      orderBy: [
        { category: 'asc' },
        { place: 'asc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
  }

  /**
   * Получить финалиста по ID
   */
  async getFinalistById(id: string): Promise<Finalist | null> {
    return prisma.finalist.findUnique({
      where: { id }
    });
  }

  /**
   * Создать нового финалиста
   */
  async createFinalist(data: CreateFinalistData): Promise<Finalist> {
    // Получить максимальный order для автоматической сортировки
    const maxOrder = await prisma.finalist.aggregate({
      _max: { order: true }
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    return prisma.finalist.create({
      data: {
        fullName: data.fullName,
        projectName: data.projectName,
        category: data.category,
        city: data.city,
        photoPath: data.photoPath,
        description: data.description,
        place: data.place,
        isWinner: data.isWinner ?? false,
        order: data.order ?? nextOrder,
        isActive: data.isActive ?? true
      }
    });
  }

  /**
   * Обновить финалиста
   */
  async updateFinalist(id: string, data: UpdateFinalistData): Promise<Finalist> {
    return prisma.finalist.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.projectName !== undefined && { projectName: data.projectName }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.photoPath !== undefined && { photoPath: data.photoPath }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.place !== undefined && { place: data.place }),
        ...(data.isWinner !== undefined && { isWinner: data.isWinner }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });
  }

  /**
   * Удалить финалиста
   */
  async deleteFinalist(id: string): Promise<void> {
    await prisma.finalist.delete({
      where: { id }
    });
  }

  /**
   * Обновить порядок отображения
   */
  async updateOrder(items: { id: string; order: number }[]): Promise<void> {
    await prisma.$transaction(
      items.map(item =>
        prisma.finalist.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
  }

  /**
   * Получить статистику по финалистам
   */
  async getStats(): Promise<{
    total: number;
    byCategory: Record<ApplicationCategory, number>;
    winners: number;
  }> {
    const [total, starter, active, it, winners] = await Promise.all([
      prisma.finalist.count({ where: { isActive: true } }),
      prisma.finalist.count({ where: { isActive: true, category: 'starter' } }),
      prisma.finalist.count({ where: { isActive: true, category: 'active' } }),
      prisma.finalist.count({ where: { isActive: true, category: 'it' } }),
      prisma.finalist.count({ where: { isActive: true, isWinner: true } })
    ]);

    return {
      total,
      byCategory: { starter, active, it },
      winners
    };
  }
}
