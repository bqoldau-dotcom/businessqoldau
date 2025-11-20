import prisma from '../config/database';

interface CreateContactData {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  /**
   * Create a new contact message
   */
  async createContact(data: CreateContactData) {
    return await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
  },

  /**
   * Get all contacts (for admin)
   */
  async getAllContacts() {
    return await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Get contact by ID (for admin)
   */
  async getContactById(id: string) {
    return await prisma.contact.findUnique({
      where: { id },
    });
  },
};