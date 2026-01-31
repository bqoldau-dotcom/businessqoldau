# 🎯 Задача: Деплой Business Qoldau на домен businessqoldau.kz

## 📋 Описание задачи

**Цель**: Развернуть полнофункциональную платформу бизнес-конкурса Business Qoldau на домене businessqoldau.kz

**Проект**: Двуязычная (русский/казахский) платформа для бизнес-конкурса с системой подачи заявок, аутентификацией, админ-панелью и управлением периодами подачи.

**Домен**: businessqoldau.kz

**Дата создания документа**: 2025-01-01

---

## 🏗️ Архитектура системы

### Компоненты для деплоя

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

### Технологический стек

**Frontend:**
- Nuxt 3 (SSR)
- Tailwind CSS
- @nuxtjs/i18n (русский/казахский)
- @nuxt/content (Markdown контент)

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT аутентификация
- Multer (загрузка файлов)
- Nodemailer (email уведомления)

---

## 📁 Структура проекта

```
/home/rus/projects/businessqoldau/
├── .env                           # Frontend переменные окружения
├── nuxt.config.ts                 # Nuxt конфигурация
├── package.json                   # Frontend зависимости
├── ecosystem.config.js            # PM2 конфигурация
├── deploy.sh                      # Скрипт автоматического деплоя
├── backend/
│   ├── .env                       # Backend переменные окружения
│   ├── package.json               # Backend зависимости
│   ├── src/                       # Backend исходный код
│   ├── prisma/                    # Database schema и миграции
│   └── uploads/                   # Загруженные файлы
├── pages/                         # Frontend страницы
├── components/                    # Vue компоненты
├── composables/                   # Vue composables
└── content/                       # Markdown контент
```

---

## 🎯 Пошаговый план выполнения

### Этап 1: Подготовка инфраструктуры ✅

**Статус**: Готово (согласно DEPLOYMENT.md)

**Что уже настроено:**
- ✅ Nginx с SSL сертификатами (до 2025-12-29)
- ✅ PostgreSQL на порту 5436
- ✅ PM2 для управления процессами
- ✅ Домен businessqoldau.kz настроен

**Файлы конфигурации:**
- `/home/rus/infrastructure/nginx/sites-enabled/businessqoldau.kz.conf`
- SSL сертификаты: `/etc/letsencrypt/live/businessqoldau.kz/`

### Этап 2: Настройка базы данных

**Место выполнения**: Сервер с PostgreSQL

**Команды:**
```bash
# 1. Подключение к PostgreSQL
cd ~/infrastructure
sg docker -c "~/docker-compose exec -it shared-postgres psql -U postgres"

# 2. Создание пользователя и базы данных
CREATE USER businesscamp_user WITH PASSWORD 'secure_password_here';
CREATE DATABASE businesscamp OWNER businesscamp_user;
GRANT ALL PRIVILEGES ON DATABASE businesscamp TO businesscamp_user;
\q
```

**Результат**: База данных `businesscamp` создана с пользователем `businesscamp_user`

### Этап 3: Настройка переменных окружения

#### Frontend (.env в корне проекта)

**Файл**: `/home/rus/projects/businessqoldau/.env`

**Содержимое:**
```env
BASE_URL=https://businessqoldau.kz
NUXT_PUBLIC_API_URL=https://businessqoldau.kz/api
NODE_ENV=production
```

#### Backend (.env в backend/ директории)

**Файл**: `/home/rus/projects/businessqoldau/backend/.env`

**Содержимое:**
```env
# Database
DATABASE_URL=postgresql://businesscamp_user:secure_password_here@localhost:5436/businesscamp?schema=public

# JWT Secrets (ВАЖНО: сгенерировать новые для production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# SMTP (настроить для отправки email)
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

### Этап 4: Сборка и развертывание

**Место выполнения**: `/home/rus/projects/businessqoldau/`

**Команды:**
```bash
# 1. Переход в проект
cd ~/projects/businessqoldau

# 2. Установка frontend зависимостей
npm install

# 3. Backend: установка зависимостей
cd backend
npm install

# 4. Применение миграций БД
npm run prisma:migrate deploy
npm run prisma:generate

# 5. Сборка backend
npm run build

# 6. Frontend: сборка
cd ..
npm run build

# 7. Создание директории для логов
mkdir -p logs

# 8. Запуск через PM2
pm2 start ecosystem.config.js

# 9. Настройка автозапуска
pm2 startup
pm2 save
```

### Этап 5: Проверка и тестирование

**Команды проверки:**
```bash
# 1. Статус процессов
pm2 status

# 2. Логи
pm2 logs businessqoldau-nuxt --lines 20
pm2 logs businessqoldau-backend --lines 20

# 3. Health check
curl -I https://businessqoldau.kz
curl https://businessqoldau.kz/api/health

# 4. Проверка Nginx
sudo nginx -t
sudo systemctl status nginx
```

---

## 🚀 Автоматический деплой

### Использование готового скрипта

**Файл**: `/home/rus/projects/businessqoldau/deploy.sh`

**Команда:**
```bash
cd ~/projects/businessqoldau
chmod +x deploy.sh
./deploy.sh
```

**Что делает скрипт:**
1. Получает последние изменения из Git
2. Устанавливает зависимости
3. Применяет миграции БД
4. Собирает backend и frontend
5. Перезапускает PM2 процессы
6. Проверяет статус

---

## 📊 Мониторинг и управление

### PM2 команды

```bash
# Статус процессов
pm2 status

# Логи в реальном времени
pm2 logs --lines 50

# Мониторинг ресурсов
pm2 monit

# Перезапуск
pm2 restart all

# Остановка
pm2 stop all
```

### Логи для отладки

```bash
# PM2 логи
pm2 logs businessqoldau-nuxt
pm2 logs businessqoldau-backend

# Nginx логи
sudo tail -f /var/log/nginx/businessqoldau_access.log
sudo tail -f /var/log/nginx/businessqoldau_error.log

# Файловые логи
tail -f ~/projects/businessqoldau/logs/nuxt-out.log
tail -f ~/projects/businessqoldau/logs/backend-out.log
```

---

## ⚠️ Важные моменты

### Безопасность
- **ОБЯЗАТЕЛЬНО** сгенерировать новые JWT секреты для production
- Настроить надежные пароли для БД
- Настроить SMTP для отправки email уведомлений

### Файлы
- Загруженные файлы сохраняются в `backend/uploads/`
- Nginx настроен для раздачи статических файлов
- Максимальный размер файла: 20MB для PDF, 300MB для видео

### Порты
- **Nginx**: 80/443 (внешние)
- **Nuxt**: 3002 (внутренний)
- **Backend**: 3001 (внутренний)
- **PostgreSQL**: 5436 (внутренний)

---

## 🚨 Решение проблем

### Сайт недоступен (502 Bad Gateway)
```bash
pm2 restart all
sudo systemctl reload nginx
```

### База данных недоступна
```bash
cd ~/infrastructure
sg docker -c "~/docker-compose restart shared-postgres"
```

### SSL проблемы
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### PM2 процесс постоянно перезапускается
```bash
pm2 logs businessqoldau-nuxt --err --lines 100
pm2 delete businessqoldau-nuxt
pm2 start ecosystem.config.js --only businessqoldau-nuxt
```

---

## ✅ Чек-лист деплоя

- [ ] База данных создана и настроена
- [ ] Frontend .env файл настроен
- [ ] Backend .env файл настроен
- [ ] JWT секреты сгенерированы
- [ ] SMTP настройки проверены
- [ ] Зависимости установлены (frontend + backend)
- [ ] Миграции применены
- [ ] Backend собран (npm run build)
- [ ] Frontend собран (npm run build)
- [ ] Директория logs создана
- [ ] PM2 процессы запущены
- [ ] PM2 автозапуск настроен
- [ ] Nginx перезагружен
- [ ] SSL сертификаты активны
- [ ] Сайт доступен по https://businessqoldau.kz
- [ ] API работает (https://businessqoldau.kz/api/health)
- [ ] Логи проверены на ошибки

---

## 📞 Контакты и ресурсы

**Домен**: https://businessqoldau.kz
**API**: https://businessqoldau.kz/api
**Проект**: `/home/rus/projects/businessqoldau`
**Nginx конфиг**: `/home/rus/infrastructure/nginx/sites-enabled/businessqoldau.kz.conf`
**Документация**: `/home/rus/projects/businessqoldau/DEPLOYMENT.md`

---

**📅 Создано**: 2025-01-01
**👤 Ответственный**: Системный администратор
**🌐 Домен**: businessqoldau.kz
**🔐 SSL**: до 2025-12-29
```

Создал подробный документ с описанием задачи деплоя. Документ включает:

1. **Описание задачи** - что нужно сделать
2. **Архитектуру системы** - как устроено приложение
3. **Структуру проекта** - где что находится
4. **Пошаговый план** - что и где делать
5. **Команды для выполнения** - конкретные инструкции
6. **Мониторинг** - как проверить работу
7. **Решение проблем** - что делать при ошибках
8. **Чек-лист** - контрольный список

