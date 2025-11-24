import prisma from '../config/database';
import { ApplicationStatus } from '@prisma/client';

/**
 * Get all applications with filters and pagination
 */
export const getAllApplications = async (params: {
  status?: ApplicationStatus;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const { status, category, page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;

  // Build filter object
  const where: any = {};
  if (status) {
    where.status = status;
  }
  if (category) {
    where.category = category;
  }

  // Get applications with user info and files
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            profile: {
              select: {
                fullName: true,
                phone: true,
                city: true,
              },
            },
          },
        },
        files: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.application.count({ where }),
  ]);

  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update application status (admin only)
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
  message?: string
) => {
  // Check if application exists
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true,
              phone: true,
              city: true,
            },
          },
        },
      },
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  // Update status
  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              fullName: true,
              phone: true,
              city: true,
            },
          },
        },
      },
    },
  });

  // Send email notification if status is accepted, rejected, or revision and message is provided
  if ((status === 'accepted' || status === 'rejected' || status === 'revision') && message) {
    const { sendApplicationStatusEmail } = await import('../utils/email');

    const fullName = updated.user.profile?.fullName || 'Участник';

    try {
      await sendApplicationStatusEmail(
        updated.user.email,
        fullName,
        status as 'accepted' | 'rejected' | 'revision',
        message,
        {
          category: updated.category,
          createdAt: updated.createdAt,
        }
      );
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
      // Don't throw error - status update should succeed even if email fails
    }
  }

  return updated;
};

/**
 * Get all users with profiles
 */
export const getAllUsers = async (params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  emailVerified?: boolean;
}) => {
  const { page = 1, limit = 50, role, search, emailVerified } = params;
  const skip = (page - 1) * limit;

  // Build filter
  const where: any = {};

  // Role filter
  if (role) {
    where.role = role;
  }

  // Email verified filter
  if (emailVerified !== undefined) {
    where.emailVerified = emailVerified;
  }

  // Search filter (search in email and profile fullName)
  if (search && search.trim()) {
    where.OR = [
      {
        email: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      },
      {
        profile: {
          fullName: {
            contains: search.trim(),
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            fullName: true,
            phone: true,
            city: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get all contacts with pagination
 */
export const getAllContacts = async (params: {
  page?: number;
  limit?: number;
}) => {
  const { page = 1, limit = 50 } = params;
  const skip = (page - 1) * limit;

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      skip,
      take: limit,
      include: {
        repliedBy: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.contact.count(),
  ]);

  return {
    contacts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get contact by ID
 */
export const getContactById = async (contactId: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
    include: {
      repliedBy: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!contact) {
    throw new Error('Contact not found');
  }

  return contact;
};

/**
 * Get application statistics
 */
export const getApplicationStats = async () => {
  // Calculate date 30 days ago for registration dynamics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [total, byStatus, byCategory, totalUsers, recentUsers, totalContacts, recentContacts] = await Promise.all([
    prisma.application.count(),
    prisma.application.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.application.groupBy({
      by: ['category'],
      _count: true,
    }),
    // Total users count
    prisma.user.count(),
    // Users registered in last 30 days
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
    // Total contacts count
    prisma.contact.count(),
    // Contacts from last 30 days
    prisma.contact.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  // Group registrations by day
  const registrationsByDay = groupUsersByDay(recentUsers, thirtyDaysAgo);

  // Group contacts by day
  const contactsByDay = groupUsersByDay(recentContacts, thirtyDaysAgo);

  return {
    total,
    totalUsers,
    totalContacts,
    byStatus: byStatus.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>),
    byCategory: byCategory.reduce((acc, item) => {
      acc[item.category] = item._count;
      return acc;
    }, {} as Record<string, number>),
    registrationsByDay,
    contactsByDay,
  };
};

/**
 * Reply to contact form submission
 */
export const replyToContact = async (
  contactId: string,
  replyMessage: string,
  repliedById: string
) => {
  // Check if contact exists
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });

  if (!contact) {
    throw new Error('Contact not found');
  }

  // Send reply email
  const { sendContactReplyEmail } = await import('../utils/email');

  try {
    await sendContactReplyEmail(
      contact.email,
      contact.name,
      contact.message,
      replyMessage
    );
  } catch (emailError) {
    console.error('Failed to send reply email:', emailError);
    throw new Error('Failed to send email');
  }

  // Update contact with reply information
  const updatedContact = await prisma.contact.update({
    where: { id: contactId },
    data: {
      repliedAt: new Date(),
      repliedById,
    },
    include: {
      repliedBy: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return updatedContact;
};

/**
 * Helper function to group users by day
 */
function groupUsersByDay(
  users: { createdAt: Date }[],
  startDate: Date
): { date: string; count: number }[] {
  // Create a map for all dates in the range
  const dateMap = new Map<string, number>();

  // Initialize all days with 0
  const currentDate = new Date(startDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today

  while (currentDate <= today) {
    const dateKey = currentDate.toISOString().split('T')[0];
    dateMap.set(dateKey, 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Count users for each day
  users.forEach(user => {
    const dateKey = user.createdAt.toISOString().split('T')[0];
    const currentCount = dateMap.get(dateKey) || 0;
    dateMap.set(dateKey, currentCount + 1);
  });

  // Convert map to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
