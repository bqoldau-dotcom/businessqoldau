# 🚀 Быстрое руководство по деплою

## Текущая Production конфигурация

**Домен**: https://businessqoldau.kz
**VPS**: Shared infrastructure
**Дата деплоя**: 2025-10-02

### Инфраструктура

```
Nginx (80/443) → SSL Termination
    ├─→ Frontend: localhost:3004 (Nuxt.js SSR)
    └─→ Backend: localhost:3001 (Express.js API)
              └─→ PostgreSQL: localhost:5436 (database: businesscamp)
```

## PM2 Процессы

```bash
# Просмотр статуса
pm2 list

# Логи
pm2 logs businessqoldau-nuxt      # Frontend logs
pm2 logs businessqoldau-backend   # Backend logs

# Рестарт
pm2 restart businessqoldau-nuxt
pm2 restart businessqoldau-backend
pm2 restart all

# Сохранить конфигурацию
pm2 save
```

## Обновление кода (Deployment)

### 1. Подготовка
```bash
cd /home/rus/projects/businessqoldau

# Получить последние изменения
git pull origin main
```

### 2. Установка зависимостей (если изменились)
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Миграции БД (если изменилась schema)
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
cd ..
```

### 4. Сборка
```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
cd ..
```

### 5. Деплой
```bash
# Перезапустить PM2 процессы
pm2 restart all

# Сохранить состояние
pm2 save
```

### 6. Проверка
```bash
# Статус процессов
pm2 status

# Проверка API
curl https://businessqoldau.kz/api/
curl http://localhost:3001/health

# Проверка Frontend
curl -I https://businessqoldau.kz

# Логи
pm2 logs --lines 20
```

## Environment файлы

### Frontend `.env`
```env
BASE_URL=https://businessqoldau.kz
NUXT_PUBLIC_API_URL=https://businessqoldau.kz/api
```

### Backend `backend/.env`
```env
DATABASE_URL="postgresql://businesscamp:businesscamp123@localhost:5436/businesscamp?schema=public"
JWT_SECRET="<production-secret-128-chars>"
JWT_REFRESH_SECRET="<production-refresh-secret-128-chars>"
PORT=3001
NODE_ENV="production"
FRONTEND_URL="https://businessqoldau.kz"
# ... остальные переменные см. backend/.env.example
```

## Nginx конфигурация

**Файл**: `/home/rus/infrastructure/nginx/sites-enabled/businessqoldau.kz.conf`

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка Nginx
sudo systemctl reload nginx

# Статус Nginx
sudo systemctl status nginx
```

## SSL/TLS сертификаты

**Провайдер**: Let's Encrypt
**Срок действия**: До 2025-12-29
**Автообновление**: Через Certbot

```bash
# Проверка сертификата
sudo certbot certificates

# Ручное обновление (если нужно)
sudo certbot renew

# Тест обновления
sudo certbot renew --dry-run
```

## Логи

### PM2 логи
```bash
# Все логи
pm2 logs

# Конкретный процесс
pm2 logs businessqoldau-backend

# Файлы логов
/home/rus/projects/businessqoldau/logs/backend-out.log
/home/rus/projects/businessqoldau/logs/backend-error.log
/home/rus/projects/businessqoldau/logs/nuxt-out.log
/home/rus/projects/businessqoldau/logs/nuxt-error.log
```

### Nginx логи
```bash
# Access log
tail -f /var/log/nginx/businessqoldau_access.log

# Error log
tail -f /var/log/nginx/businessqoldau_error.log
```

### PostgreSQL логи
```bash
# Подключение к БД
PGPASSWORD=businesscamp123 psql -U businesscamp -h localhost -p 5436 -d businesscamp

# Проверка соединений
SELECT count(*) FROM pg_stat_activity WHERE datname = 'businesscamp';
```

## Troubleshooting

### Backend не отвечает
```bash
# Проверить процесс
pm2 list
lsof -i :3001

# Перезапустить
pm2 restart businessqoldau-backend
pm2 logs businessqoldau-backend --lines 50
```

### Frontend не работает
```bash
# Проверить процесс
pm2 list
lsof -i :3004

# Перезапустить
pm2 restart businessqoldau-nuxt
pm2 logs businessqoldau-nuxt --lines 50
```

### Nginx ошибки
```bash
# Проверить конфигурацию
sudo nginx -t

# Проверить статус
sudo systemctl status nginx

# Перезапустить
sudo systemctl restart nginx

# Логи ошибок
sudo tail -f /var/log/nginx/error.log
```

### База данных недоступна
```bash
# Проверить PostgreSQL
sudo systemctl status postgresql

# Проверить соединение
PGPASSWORD=businesscamp123 psql -U businesscamp -h localhost -p 5436 -d businesscamp -c "SELECT 1"

# Проверить миграции Prisma
cd backend
npx prisma migrate status
```

### PM2 процессы не запускаются
```bash
# Полностью остановить и удалить
pm2 delete all

# Запустить заново
pm2 start ecosystem.config.cjs

# Сохранить
pm2 save
```

## Бэкапы

### База данных
```bash
# Создать бэкап
PGPASSWORD=businesscamp123 pg_dump \
  -U businesscamp \
  -h localhost \
  -p 5436 \
  -d businesscamp \
  > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из бэкапа
PGPASSWORD=businesscamp123 psql \
  -U businesscamp \
  -h localhost \
  -p 5436 \
  -d businesscamp \
  < backup_20250102_120000.sql
```

### Загруженные файлы
```bash
# Создать архив uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/

# Восстановить
tar -xzf uploads_backup_20250102.tar.gz
```

## Мониторинг

### Проверка работоспособности
```bash
# Health check
curl http://localhost:3001/health

# API endpoints
curl https://businessqoldau.kz/api/

# Frontend
curl -I https://businessqoldau.kz
```

### PM2 Monitoring
```bash
# Мониторинг в реальном времени
pm2 monit

# Статистика
pm2 status
```

## Полезные команды

```bash
# Быстрый деплой (full rebuild)
cd /home/rus/projects/businessqoldau
git pull origin main
npm install
cd backend && npm install && npm run build && cd ..
npm run build
pm2 restart all
pm2 logs --lines 20

# Просмотр всех портов
sudo netstat -tulpn | grep -E '3001|3004|5436'

# Убить процесс на порту (если зависло)
kill $(lsof -t -i:3001)
kill $(lsof -t -i:3004)

# Проверка дискового пространства
df -h

# Проверка памяти
free -h
```

---

**📅 Обновлено**: 2025-10-02
**👤 Проект**: Business Qoldau 2025
**🌐 Домен**: businessqoldau.kz
