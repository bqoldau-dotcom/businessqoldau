# Business Camp 2025 Backend

Backend API для платформы бизнес-конкурса Business Camp 2025.

## Технологии

- **Node.js** + **Express** - веб-сервер
- **TypeScript** - типизация
- **Prisma** - ORM для PostgreSQL
- **JWT** - аутентификация
- **Multer** - загрузка файлов
- **Nodemailer** - отправка email
- **Zod** - валидация данных

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

3. **Запустите PostgreSQL через Docker** (рекомендуется для разработки):
```bash
docker-compose up -d
```

Или установите PostgreSQL локально и создайте БД:
```bash
createdb businesscamp
```

4. Запустите миграции:
```bash
npm run prisma:migrate
```

5. Сгенерируйте Prisma Client:
```bash
npm run prisma:generate
```

## Разработка

Запуск dev-сервера с hot-reload:
```bash
npm run dev
```

Prisma Studio (GUI для БД):
```bash
npm run prisma:studio
```

### Docker команды

```bash
# Запустить PostgreSQL
docker-compose up -d

# Остановить PostgreSQL
docker-compose down

# Остановить и удалить данные
docker-compose down -v

# Посмотреть логи
docker-compose logs -f

# Подключиться к PostgreSQL через psql
docker exec -it businesscamp-postgres psql -U postgres -d businesscamp
```

## Production

Сборка проекта:
```bash
npm run build
```

Запуск production-сервера:
```bash
npm start
```

## Структура проекта

```
backend/
├── src/
│   ├── config/         # Конфигурация (database, jwt, email)
│   ├── middleware/     # Middleware (auth, errorHandler)
│   ├── routes/         # API роуты
│   ├── controllers/    # Контроллеры
│   ├── services/       # Бизнес-логика
│   ├── utils/          # Утилиты
│   └── index.ts        # Точка входа
├── prisma/
│   └── schema.prisma   # Схема БД
├── uploads/            # Загруженные файлы
└── dist/               # Скомпилированный код
```

## API Endpoints (в разработке)

- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/profile` - Профиль пользователя
- `POST /api/applications` - Создать заявку
- `POST /api/contacts` - Отправить сообщение

## Статус разработки

✅ Этап 1: Окружение и структура проекта
❌ Этап 2: Аутентификация
❌ Этап 3: Профили пользователей
❌ Этап 4: Заявки
❌ Этап 5: Контактная форма
❌ Этап 6: Администрирование
❌ Этап 7: Тестирование
❌ Этап 8: Деплой