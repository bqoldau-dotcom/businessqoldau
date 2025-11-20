# 1. Базовый образ Node.js
FROM node:20-alpine AS builder

# 2. Рабочая директория
WORKDIR /app

# 3. Копируем фронтенд package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install
RUN rm -rf .nuxt

# 4. Копируем весь фронтенд код
COPY . .
# Копируем публичные файлы отдельно (favicon, SVG и т.д.)
COPY public ./public
RUN npm run build

# 5. Бэкенд
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend ./
RUN npm run build

# 6. Финальный образ
FROM node:20-alpine
WORKDIR /app

# Копируем собранный фронтенд
COPY --from=builder /app/.output ./
# Копируем public, чтобы все статические файлы были доступны
COPY --from=builder /app/public ./public

# Копируем бэкенд
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Указываем порт
ENV PORT 8080
EXPOSE 8080

# Старт сервера
CMD ["node", "backend/dist/index.js"]
