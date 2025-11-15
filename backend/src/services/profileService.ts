import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface ProfileInput {
  fullName: string;
  phone: string;
  city: string;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  city: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const getProfile = async (userId: string): Promise<ProfileResponse | null> => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return profile;
};

export const createProfile = async (userId: string, input: ProfileInput): Promise<ProfileResponse> => {
  const { fullName, phone, city } = input;

  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (existingProfile) {
    throw new AppError('Profile already exists', 400);
  }

  // Create profile
  const profile = await prisma.profile.create({
    data: {
      userId,
      fullName,
      phone,
      city,
    },
  });

  return profile;
};

export const updateProfile = async (userId: string, input: Partial<ProfileInput>): Promise<ProfileResponse> => {
  // Check if profile exists
  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!existingProfile) {
    throw new AppError('Profile not found', 404);
  }

  // Update profile
  const profile = await prisma.profile.update({
    where: { userId },
    data: input,
  });

  return profile;
};