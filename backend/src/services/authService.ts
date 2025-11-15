import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry, verifyRefreshToken } from '../utils/jwt';
import { generateToken, generateVerificationCode, sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { AppError } from '../middleware/errorHandler';

const SALT_ROUNDS = 10;

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
    role: string;
  };
}

export const register = async (input: RegisterInput): Promise<{ userId: string }> => {
  const { email, password, fullName, phone } = input;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user and profile in a transaction
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      emailVerified: false, // Require email verification
      profile: {
        create: {
          fullName,
          phone,
        },
      },
    },
  });

  // Generate verification code and token
  const verificationCode = generateVerificationCode();
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

  // Save verification token
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      code: verificationCode,
      expiresAt,
    },
  });

  // Send verification email
  try {
    await sendVerificationEmail(email, verificationCode);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // Don't fail registration if email fails, user can request new code
  }

  return { userId: user.id };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Неверный email или пароль', 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw new AppError('Неверный email или пароль', 401);
  }

  // Check email verification
  if (!user.emailVerified) {
    throw new AppError('Email not verified. Please check your email for verification code.', 403, 'EMAIL_NOT_VERIFIED');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string }> => {
  // Verify refresh token
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Check if refresh token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError('Refresh token expired or invalid', 401);
  }

  // Generate new access token
  const accessToken = generateAccessToken(payload.userId);

  return { accessToken };
};

export const logout = async (refreshToken: string): Promise<void> => {
  // Delete refresh token from database
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
};

export const verifyEmail = async (email: string, code: string): Promise<void> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Find verification token by userId and code
  const verificationToken = await prisma.emailVerificationToken.findFirst({
    where: {
      userId: user.id,
      code: code,
    },
  });

  if (!verificationToken) {
    throw new AppError('Invalid verification code', 400);
  }

  if (verificationToken.expiresAt < new Date()) {
    throw new AppError('Verification code expired', 400);
  }

  // Update user
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: true },
  });

  // Delete all verification tokens for this user
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });
};

export const resendVerificationCode = async (email: string): Promise<void> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.emailVerified) {
    throw new AppError('Email already verified', 400);
  }

  // Delete old verification tokens
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  // Generate new verification code and token
  const verificationCode = generateVerificationCode();
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

  // Save verification token
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token,
      code: verificationCode,
      expiresAt,
    },
  });

  // Send verification email
  await sendVerificationEmail(email, verificationCode);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Пользователь с таким email не найден', 404);
  }

  // Generate reset code and token
  const resetCode = generateVerificationCode();
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

  // Delete any existing reset tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      code: resetCode,
      expiresAt,
    },
  });

  // Send password reset email with code
  try {
    await sendPasswordResetEmail(email, resetCode);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new AppError('Failed to send password reset email', 500);
  }
};

export const verifyResetCode = async (email: string, code: string): Promise<void> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Find reset token by userId and code
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      code: code,
    },
  });

  if (!resetToken) {
    throw new AppError('Invalid reset code', 400);
  }

  if (resetToken.expiresAt < new Date()) {
    throw new AppError('Reset code expired', 400);
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Find reset token by userId and code
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      code: code,
    },
  });

  if (!resetToken) {
    throw new AppError('Invalid reset code', 400);
  }

  if (resetToken.expiresAt < new Date()) {
    throw new AppError('Reset code expired', 400);
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  // Update user password
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  // Delete all reset tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // Delete all refresh tokens for this user (force re-login)
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};