import { Request, Response } from 'express';
import { templateService } from '../services/templateService';
import { z } from 'zod';

const uploadTemplateSchema = z.object({
  name: z.string().min(1).max(200)
});

// GET /api/templates/active - Get current active template (authenticated users)
export async function getActiveTemplate(req: Request, res: Response) {
  try {
    const template = await templateService.getActiveTemplate();

    if (!template) {
      return res.status(404).json({ error: 'No template available' });
    }

    return res.json(template);
  } catch (error) {
    console.error('Get active template error:', error);
    return res.status(500).json({ error: 'Failed to get template' });
  }
}

// POST /api/templates/upload - Upload new template (admin only)
export async function uploadTemplateHandler(req: Request, res: Response) {
  try {
    const { name } = uploadTemplateSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Validate file type (PDF, DOC, DOCX)
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed'
      });
    }

    const uploadedById = (req as any).userId;
    const template = await templateService.uploadTemplate(req.file, uploadedById, name);

    return res.status(201).json({
      message: 'Template uploaded successfully',
      template
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    console.error('Upload template error:', error);
    return res.status(500).json({ error: 'Failed to upload template' });
  }
}

// GET /api/templates/all - Get all templates (admin only)
export async function getAllTemplates(req: Request, res: Response) {
  try {
    const templates = await templateService.getAllTemplates();
    return res.json({ templates });
  } catch (error) {
    console.error('Get all templates error:', error);
    return res.status(500).json({ error: 'Failed to get templates' });
  }
}

// DELETE /api/templates/:id - Delete template (admin only)
export async function deleteTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await templateService.deleteTemplate(id);
    return res.json(result);
  } catch (error: any) {
    if (error.message === 'Template not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Delete template error:', error);
    return res.status(500).json({ error: 'Failed to delete template' });
  }
}
