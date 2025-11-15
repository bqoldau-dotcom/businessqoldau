import rateLimit from 'express-rate-limit';

/**
 * Rate limiter для auth endpoints (register/login)
 * Защита от brute-force атак
 *
 * Лимит: 10 попыток за 15 минут с одного IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // максимум 10 запросов (увеличено для разработки)
  message: {
    status: 'error',
    message: 'Слишком много попыток входа. Попробуйте через 15 минут.'
  },
  standardHeaders: 'draft-7', // Use draft-7 headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Считаем все запросы (включая успешные)
  // Правильная обработка IP за Nginx proxy
  validate: {
    xForwardedForHeader: false, // Отключаем валидацию X-Forwarded-For
  },
});

/**
 * Rate limiter для forgot-password endpoint
 * Более строгий лимит для предотвращения спама
 *
 * Лимит: 3 попытки за 15 минут с одного IP
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 3, // максимум 3 запроса
  message: {
    status: 'error',
    message: 'Слишком много запросов на восстановление пароля. Попробуйте через 15 минут.'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
  },
});

/**
 * Общий rate limiter для всех API endpoints
 * Защита от DDoS атак
 *
 * Лимит: 100 запросов за 15 минут с одного IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: {
    status: 'error',
    message: 'Слишком много запросов. Попробуйте позже.'
  },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  // Не применяем к health check
  skip: (req) => req.path === '/health',
  validate: {
    xForwardedForHeader: false,
  },
});
