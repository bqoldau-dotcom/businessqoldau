# 🚀 Документация по развертыванию Business Qoldau

## 📋 Оглавление

1. [Обзор инфраструктуры](#обзор-инфраструктуры)
2. [SSL сертификаты](#ssl-сертификаты)
3. [Конфигурация Nginx](#конфигурация-nginx)
4. [База данных](#база-данных)
5. [Переменные окружения](#переменные-окружения)
6. [Развертывание приложения](#развертывание-приложения)
7. [Управление процессами](#управление-процессами)
8. [Обновление приложения](#обновление-приложения)
9. [Мониторинг и логи](#мониторинг-и-логи)
10. [Решение проблем](#решение-проблем)

---

## 🏗️ Обзор инфраструктуры

### Компоненты системы

```
┌─────────────────────────────────────────────────┐
│                    Nginx                        │
│          SSL Termination + Proxy                │
│              businessqoldau.kz                  │
│                 Port 80/443                     │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│            Nuxt.js Application                  │
│         (Frontend + Backend API)                │
│              Port 3002                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              PostgreSQL Database                │
│          (Shared Infrastructure)                │
│                Port 5436                        │
└─────────────────────────────────────────────────┘
```

> **Примечание**: Подробная архитектура системы описана в [ARCHITECTURE.md](ARCHITECTURE.md)

---

## 🔒 SSL сертификаты

### Текущие сертификаты

- **Домен**: businessqoldau.kz, www.businessqoldau.kz
- **Тип ключа**: ECDSA
- **Срок действия**: до 2025-12-29 (89 дней)
- **Путь**: `/etc/letsencrypt/live/businessqoldau.kz/`
  - `fullchain.pem` - Полная цепочка сертификатов
  - `privkey.pem` - Приватный ключ

### Проверка сертификатов

```bash
# Информация о сертификате
sudo certbot certificates

# Детали конкретного сертификата
sudo openssl x509 -in /etc/letsencrypt/live/businessqoldau.kz/fullchain.pem -text -noout

# Срок действия
sudo openssl x509 -in /etc/letsencrypt/live/businessqoldau.kz/fullchain.pem -noout -dates
```

### Обновление сертификатов

```bash
# Тестирование автообновления
sudo certbot renew --dry-run

# Принудительное обновление
sudo certbot renew --force-renewal

# Перезапуск Nginx после обновления
sudo systemctl reload nginx
```

### Автообновление (настроено)

Certbot автоматически обновляет сертификаты через systemd timer:
```bash
# Проверка статуса
systemctl status certbot.timer

# Логи обновлений
sudo journalctl -u certbot.renew.service
```

---

## 🌐 Конфигурация Nginx

### Расположение конфигурации

- **Файл**: `/home/rus/infrastructure/nginx/sites-enabled/businessqoldau.kz.conf`
- **Симлинк**: `/etc/nginx/sites-enabled/businessqoldau.kz.conf`

### Особенности конфигурации

- **Порт приложения**: 3002
- **HTTP → HTTPS редирект**: Все запросы на HTTP перенаправляются на HTTPS
- **WebSocket поддержка**: Для HMR (Hot Module Replacement) в dev режиме
- **Кэширование**: Статические ресурсы (_nuxt/) кэшируются на 1 год
- **API**: Эндпоинты /api/ без кэширования
- **Max upload size**: 100MB (для загрузки бизнес-планов и видео)

### Команды управления Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка без остановки
sudo systemctl reload nginx

# Полный перезапуск
sudo systemctl restart nginx

# Статус
sudo systemctl status nginx

# Логи
sudo tail -f /var/log/nginx/businessqoldau_access.log
sudo tail -f /var/log/nginx/businessqoldau_error.log
```

---

## 🗄️ База данных

### Подключение

Проект использует общую PostgreSQL инфраструктуру:

- **Host**: shared-postgres (Docker контейнер) или localhost:5436
- **Database**: businesscamp
- **User**: (настроить в .env)
- **Schema**: Определена в `backend/prisma/schema.prisma`

### Создание базы данных

```bash
# Подключение к PostgreSQL
cd ~/infrastructure
sg docker -c "~/docker-compose exec -it shared-postgres psql -U postgres"

# В psql выполните:
CREATE USER businesscamp_user WITH PASSWORD 'secure_password_here';
CREATE DATABASE businesscamp OWNER businesscamp_user;
GRANT ALL PRIVILEGES ON DATABASE businesscamp TO businesscamp_user;
\q
```

### Миграции Prisma

```bash
cd ~/projects/businessqoldau/backend

# Применить миграции
npm run prisma:migrate

# Генерация Prisma Client
npm run prisma:generate

# Prisma Studio (GUI для БД)
npm run prisma:studio
```

### Бэкап базы данных

```bash
# Создание бэкапа
docker exec shared-postgres pg_dump -U postgres businesscamp > ~/backups/businesscamp_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
docker exec -i shared-postgres psql -U postgres businesscamp < ~/backups/businesscamp_YYYYMMDD_HHMMSS.sql
```

---

## 🔧 Переменные окружения

> **Примечание**: Полный список переменных окружения для разработки см. в [DEVELOPMENT.md](DEVELOPMENT.md#конфигурация)

### Production переменные

**Frontend `.env`:**
```env
BASE_URL=https://businessqoldau.kz
NUXT_PUBLIC_API_URL=https://businessqoldau.kz/api
NODE_ENV=production
```

**Backend `.env`:**
```env
# Database
DATABASE_URL=postgresql://businesscamp_user:YOUR_PASSWORD@localhost:5436/businesscamp?schema=public

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@businessqoldau.kz
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@businessqoldau.kz

# Server
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://businessqoldau.kz

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_PDF=20971520      # 20MB
MAX_FILE_SIZE_VIDEO=314572800   # 300MB

# CORS
CORS_ORIGIN=https://businessqoldau.kz
```

---

## 🚀 Развертывание приложения

### Первоначальная установка

```bash
# 1. Переход в директорию проекта
cd ~/projects/businessqoldau

# 2. Установка зависимостей
npm install

# 3. Установка зависимостей backend
cd backend
npm install

# 4. Настройка .env файлов
cp .env.example .env
nano .env  # Настройте переменные

cd ..
cp .env.example .env
nano .env  # Настройте переменные

# 5. Применение миграций БД
cd backend
npm run prisma:migrate
npm run prisma:generate

# 6. Сборка backend
npm run build

# 7. Сборка frontend (из корня проекта)
cd ..
npm run build
```

### Production сборка

```bash
# Полная пересборка проекта
cd ~/projects/businessqoldau

# Backend build
cd backend
npm run build
cd ..

# Frontend build
npm run build

# Проверка сборки
ls -la .output/server/index.mjs
```

---

## 📦 Управление процессами

### Установка PM2 (если не установлен)

```bash
sudo npm install -g pm2
```

### PM2 Ecosystem файл

Создайте `ecosystem.config.js` в корне проекта:

```javascript
module.exports = {
  apps: [
    {
      name: 'businessqoldau-nuxt',
      script: '.output/server/index.mjs',
      cwd: '/home/rus/projects/businessqoldau',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        NITRO_PORT: 3002
      },
      error_file: './logs/nuxt-error.log',
      out_file: './logs/nuxt-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M'
    },
    {
      name: 'businessqoldau-backend',
      script: 'dist/index.js',
      cwd: '/home/rus/projects/businessqoldau/backend',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '../logs/backend-error.log',
      out_file: '../logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M'
    }
  ]
};
```

### Команды PM2

```bash
cd ~/projects/businessqoldau

# Запуск всех процессов
pm2 start ecosystem.config.js

# Остановка
pm2 stop all

# Перезапуск
pm2 restart all

# Удаление из PM2
pm2 delete all

# Просмотр логов
pm2 logs businessqoldau-nuxt
pm2 logs businessqoldau-backend

# Мониторинг
pm2 monit

# Статус
pm2 status

# Автозапуск при перезагрузке сервера
pm2 startup
pm2 save
```

### Альтернативный запуск (без PM2)

```bash
# Nuxt приложение
cd ~/projects/businessqoldau
PORT=3002 node .output/server/index.mjs &

# Backend API
cd ~/projects/businessqoldau/backend
npm start &
```

---

## 🔄 Обновление приложения

### Скрипт автоматического обновления

Создайте `deploy.sh` в корне проекта:

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# 1. Переход в директорию проекта
cd /home/rus/projects/businessqoldau

# 2. Получение последних изменений из Git
echo "📥 Pulling latest changes..."
git pull origin main

# 3. Установка зависимостей
echo "📦 Installing dependencies..."
npm install

# 4. Backend: установка зависимостей и сборка
echo "🔧 Building backend..."
cd backend
npm install
npm run build

# 5. Применение миграций БД (если есть)
echo "🗄️ Running database migrations..."
npm run prisma:migrate

# 6. Генерация Prisma Client
npm run prisma:generate

# 7. Frontend: сборка
echo "🎨 Building frontend..."
cd ..
npm run build

# 8. Перезапуск PM2 процессов
echo "♻️ Restarting PM2 processes..."
pm2 restart ecosystem.config.js

# 9. Проверка статуса
echo "✅ Checking status..."
pm2 status

echo "✅ Deployment completed successfully!"
```

Сделайте скрипт исполняемым:
```bash
chmod +x deploy.sh
```

### Использование скрипта деплоя

```bash
cd ~/projects/businessqoldau
./deploy.sh
```

---

## 📊 Мониторинг и логи

### Логи приложения

```bash
# PM2 логи
pm2 logs businessqoldau-nuxt --lines 100
pm2 logs businessqoldau-backend --lines 100

# Файловые логи
tail -f ~/projects/businessqoldau/logs/nuxt-out.log
tail -f ~/projects/businessqoldau/logs/backend-out.log
tail -f ~/projects/businessqoldau/logs/nuxt-error.log
tail -f ~/projects/businessqoldau/logs/backend-error.log
```

### Логи Nginx

```bash
# Access логи
sudo tail -f /var/log/nginx/businessqoldau_access.log

# Error логи
sudo tail -f /var/log/nginx/businessqoldau_error.log
```

### Health Check

```bash
# Проверка доступности сайта
curl -I https://businessqoldau.kz

# Проверка API
curl https://businessqoldau.kz/api/health

# Проверка через локальный порт
curl http://localhost:3002
```

### Мониторинг ресурсов

```bash
# Использование ресурсов PM2 процессами
pm2 monit

# Детальная информация
pm2 show businessqoldau-nuxt
pm2 show businessqoldau-backend

# Системные ресурсы
htop
free -h
df -h
```

---

## 🔧 Решение проблем

### 1. Сайт недоступен (502 Bad Gateway)

**Причина**: Приложение не запущено или недоступно на порту 3002

```bash
# Проверьте статус PM2
pm2 status

# Проверьте порт
netstat -tlnp | grep 3002

# Перезапустите приложение
pm2 restart businessqoldau-nuxt

# Проверьте логи
pm2 logs businessqoldau-nuxt --lines 50
```

### 2. База данных недоступна

**Причина**: PostgreSQL не запущен или неправильные учетные данные

```bash
# Проверьте статус PostgreSQL
cd ~/infrastructure
sg docker -c "~/docker-compose ps"

# Проверьте подключение
psql -h localhost -p 5436 -U businesscamp_user -d businesscamp

# Перезапустите PostgreSQL
cd ~/infrastructure
sg docker -c "~/docker-compose restart shared-postgres"
```

### 3. SSL сертификат истек

```bash
# Проверьте срок действия
sudo certbot certificates

# Обновите сертификат
sudo certbot renew --force-renewal

# Перезагрузите Nginx
sudo systemctl reload nginx
```

### 4. PM2 процесс постоянно перезапускается

```bash
# Проверьте логи ошибок
pm2 logs businessqoldau-nuxt --err --lines 100

# Проверьте переменные окружения
pm2 show businessqoldau-nuxt

# Остановите и запустите заново
pm2 delete businessqoldau-nuxt
pm2 start ecosystem.config.js --only businessqoldau-nuxt
```

### 5. Большой размер логов

```bash
# Очистка PM2 логов
pm2 flush

# Ротация логов (настройка)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 📋 Чек-лист деплоя

- [ ] Код загружен на сервер (git pull)
- [ ] Зависимости установлены (npm install)
- [ ] .env файлы настроены
- [ ] База данных создана
- [ ] Миграции применены (prisma migrate)
- [ ] Backend собран (npm run build)
- [ ] Frontend собран (npm run build)
- [ ] PM2 ecosystem.config.js создан
- [ ] Приложение запущено через PM2
- [ ] Nginx конфигурация активна
- [ ] SSL сертификаты получены
- [ ] Nginx перезагружен
- [ ] Проверена доступность https://businessqoldau.kz
- [ ] Health check пройден
- [ ] Логи проверены на ошибки
- [ ] PM2 автозапуск настроен (pm2 save)

---

## 🔗 Полезные ссылки

- **Сайт**: https://businessqoldau.kz
- **API**: https://businessqoldau.kz/api
- **Nginx конфиг**: `/home/rus/infrastructure/nginx/sites-enabled/businessqoldau.kz.conf`
- **Проект**: `/home/rus/projects/businessqoldau`
- **Общая документация**: `/home/rus/infrastructure/DEPLOYMENT_DOCUMENTATION.md`

---

## 📝 Команды быстрого доступа

```bash
# Переход в проект
cd ~/projects/businessqoldau

# Деплой
./deploy.sh

# Логи
pm2 logs businessqoldau-nuxt

# Перезапуск
pm2 restart all

# Статус
pm2 status

# Nginx
sudo systemctl reload nginx
sudo tail -f /var/log/nginx/businessqoldau_error.log

# База данных
cd ~/infrastructure
sg docker -c "~/docker-compose exec -it shared-postgres psql -U postgres businesscamp"
```

---

**📅 Обновлено**: 2025-09-30
**👤 Сервер**: 207.180.243.173
**🌐 Домен**: businessqoldau.kz
**🔐 SSL**: до 2025-12-29