import prisma from '../config/database';
import { JuryMember } from '@prisma/client';

export interface CreateJuryMemberData {
  fullName: string;
  position: string;
  organization?: string;
  photoPath?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateJuryMemberData {
  fullName?: string;
  position?: string;
  organization?: string;
  photoPath?: string;
  bio?: string;
  order?: number;
  isActive?: boolean;
}

export class JuryService {
  /**
   * Получить всех активных членов жюри (публичный)
   */
  async getActiveJuryMembers(): Promise<JuryMember[]> {
    return prisma.juryMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  }

  /**
   * Получить всех членов жюри (admin)
   */
  async getAllJuryMembers(): Promise<JuryMember[]> {
    return prisma.juryMember.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
  }

  /**
   * Получить члена жюри по ID
   */
  async getJuryMemberById(id: string): Promise<JuryMember | null> {
    return prisma.juryMember.findUnique({
      where: { id }
    });
  }

  /**
   * Создать нового члена жюри
   */
  async createJuryMember(data: CreateJuryMemberData): Promise<JuryMember> {
    // Получить максимальный order для автоматической сортировки
    const maxOrder = await prisma.juryMember.aggregate({
      _max: { order: true }
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;

    return prisma.juryMember.create({
      data: {
        fullName: data.fullName,
        position: data.position,
        organization: data.organization,
        photoPath: data.photoPath,
        bio: data.bio,
        order: data.order ?? nextOrder,
        isActive: data.isActive ?? true
      }
    });
  }

  /**
   * Обновить члена жюри
   */
  async updateJuryMember(id: string, data: UpdateJuryMemberData): Promise<JuryMember> {
    return prisma.juryMember.update({
      where: { id },
      data: {
        ...(data.fullName !== undefined && { fullName: data.fullName }),
        ...(data.position !== undefined && { position: data.position }),
        ...(data.organization !== undefined && { organization: data.organization }),
        ...(data.photoPath !== undefined && { photoPath: data.photoPath }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });
  }

  /**
   * Удалить члена жюри
   */
  async deleteJuryMember(id: string): Promise<void> {
    await prisma.juryMember.delete({
      where: { id }
    });
  }

  /**
   * Обновить порядок отображения
   */
  async updateOrder(items: { id: string; order: number }[]): Promise<void> {
    await prisma.$transaction(
      items.map(item =>
        prisma.juryMember.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
  }
}
