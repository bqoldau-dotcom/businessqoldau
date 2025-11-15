export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-this-refresh-secret-in-production',
  expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as string,
  refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string,
};