import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  fullName: z.string().min(2, 'Полное имя должно содержать минимум 2 символа').max(100, 'Полное имя не должно превышать 100 символов'),
  phone: z.string().regex(/^\+77\d{9}$/, 'Телефон должен быть в формате +77XXXXXXXXX'),
});

const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(1, 'Пароль обязателен'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Токен обновления обязателен'),
});

const verifyEmailSchema = z.object({
  email: z.string().email('Неверный формат email'),
  code: z.string().length(6, 'Код подтверждения должен содержать 6 цифр'),
});

const resendVerificationSchema = z.object({
  email: z.string().email('Неверный формат email'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Неверный формат email'),
});

const verifyResetCodeSchema = z.object({
  email: z.string().email('Неверный формат email'),
  code: z.string().length(6, 'Код восстановления должен содержать 6 цифр'),
});

const resetPasswordSchema = z.object({
  email: z.string().email('Неверный формат email'),
  code: z.string().length(6, 'Код восстановления должен содержать 6 цифр'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const result = await authService.register(validatedData);

    res.status(201).json({
      message: 'Регистрация успешно завершена! Проверьте ваш email для подтверждения.',
      userId: result.userId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.login(validatedData);

    res.json({
      message: 'Login successful',
      ...result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    const result = await authService.refreshAccessToken(validatedData.refreshToken);

    res.json({
      message: 'Token refreshed',
      ...result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body);
    await authService.logout(validatedData.refreshToken);

    res.json({
      message: 'Logout successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = verifyEmailSchema.parse(req.body);
    await authService.verifyEmail(validatedData.email, validatedData.code);

    res.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const resendVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resendVerificationSchema.parse(req.body);
    await authService.resendVerificationCode(validatedData.email);

    res.json({
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    await authService.requestPasswordReset(validatedData.email);

    res.json({
      message: 'Код восстановления отправлен на ваш email',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const verifyResetCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = verifyResetCodeSchema.parse(req.body);
    await authService.verifyResetCode(validatedData.email, validatedData.code);

    res.json({
      message: 'Код подтвержден',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resetPasswordSchema.parse(req.body);
    await authService.resetPassword(validatedData.email, validatedData.code, validatedData.password);

    res.json({
      message: 'Пароль успешно изменен',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.issues[0].message, 400));
    } else {
      next(error);
    }
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await authService.getCurrentUser(req.userId);

    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};