import { Request, Response } from 'express';
import { z } from 'zod';
import { contactService } from '../services/contact.service';
import { sendContactNotification } from '../utils/email';

// Validation schema
const createContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export const contactController = {
  /**
   * POST /api/contacts
   * Create a new contact message
   */
  async createContact(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = createContactSchema.parse(req.body);

      // Create contact
      const contact = await contactService.createContact(validatedData);

      // Send email notification to admin (non-blocking)
      sendContactNotification(
        validatedData.name,
        validatedData.email,
        validatedData.message
      ).catch((emailError) => {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      });

      return res.status(201).json({
        message: 'Contact message sent successfully',
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          message: contact.message,
          created_at: contact.createdAt,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.issues,
        });
      }

      console.error('Error creating contact:', error);
      return res.status(500).json({
        message: 'Failed to send contact message',
      });
    }
  },

  /**
   * GET /api/contacts
   * Get all contacts (admin only)
   */
  async getAllContacts(req: Request, res: Response) {
    try {
      const contacts = await contactService.getAllContacts();

      return res.json({
        contacts,
        total: contacts.length,
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({
        message: 'Failed to fetch contacts',
      });
    }
  },

  /**
   * GET /api/contacts/:id
   * Get contact by ID (admin only)
   */
  async getContactById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const contact = await contactService.getContactById(id);

      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      return res.json({ contact });
    } catch (error) {
      console.error('Error fetching contact:', error);
      return res.status(500).json({
        message: 'Failed to fetch contact',
      });
    }
  },
};