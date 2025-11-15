import prisma from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

export const templateService = {
  // Get current active template
  async getActiveTemplate() {
    const template = await prisma.template.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return template;
  },

  // Upload new template (replaces existing)
  async uploadTemplate(file: Express.Multer.File, uploadedById: string, name: string) {
    // Delete old templates from database and filesystem
    const oldTemplates = await prisma.template.findMany();

    for (const oldTemplate of oldTemplates) {
      try {
        await fs.unlink(oldTemplate.filePath);
      } catch (error) {
        console.error('Failed to delete old template file:', error);
      }
    }

    await prisma.template.deleteMany();

    // Save new template
    const template = await prisma.template.create({
      data: {
        name,
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedById
      }
    });

    return template;
  },

  // Get all templates (admin only)
  async getAllTemplates() {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return templates;
  },

  // Delete template
  async deleteTemplate(id: string) {
    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Delete file from filesystem
    try {
      await fs.unlink(template.filePath);
    } catch (error) {
      console.error('Failed to delete template file:', error);
    }

    // Delete from database
    await prisma.template.delete({
      where: { id }
    });

    return { message: 'Template deleted successfully' };
  }
};
