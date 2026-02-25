import prisma from '../config/database';
import { NewsArticle } from '@prisma/client';

export interface CreateNewsData {
  title: string;
  content: string;
  publishDate?: Date;
  order?: number;
  isActive?: boolean;
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  publishDate?: Date;
  order?: number;
  isActive?: boolean;
}

export class NewsService {
  /**
   * Получить все активные новости (публичный)
   */
  async getActiveNews(): Promise<NewsArticle[]> {
    return prisma.newsArticle.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { publishDate: 'desc' }]
    });
  }

  /**
   * Получить все новости (admin)
   */
  async getAllNews(): Promise<NewsArticle[]> {
    return prisma.newsArticle.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
  }

  /**
   * Получить новость по ID
   */
  async getNewsById(id: string): Promise<NewsArticle | null> {
    return prisma.newsArticle.findUnique({
      where: { id }
    });
  }

  /**
   * Создать новую новость
   */
  async createNews(data: CreateNewsData): Promise<NewsArticle> {
    const maxOrder = await prisma.newsArticle.aggregate({
      _max: { order: true }
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    return prisma.newsArticle.create({
      data: {
        title: data.title,
        content: data.content,
        publishDate: data.publishDate ?? new Date(),
        order: data.order ?? nextOrder,
        isActive: data.isActive ?? true
      }
    });
  }

  /**
   * Обновить новость
   */
  async updateNews(id: string, data: UpdateNewsData): Promise<NewsArticle> {
    return prisma.newsArticle.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.publishDate !== undefined && { publishDate: data.publishDate }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });
  }

  /**
   * Удалить новость
   */
  async deleteNews(id: string): Promise<void> {
    await prisma.newsArticle.delete({
      where: { id }
    });
  }

  /**
   * Обновить порядок отображения
   */
  async updateOrder(items: { id: string; order: number }[]): Promise<void> {
    await prisma.$transaction(
      items.map(item =>
        prisma.newsArticle.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
  }
}
