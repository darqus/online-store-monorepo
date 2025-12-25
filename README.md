# 🛍️ Online Store - Full-Stack E-Commerce Application

Полнофункциональное e-commerce приложение с React фронтендом и Node.js бэкендом. **ПОЛНОСТЬЮ БЕСПЛАТНО** развертывается на Vercel + Supabase без каких-либо ограничений.

## 🚀 Быстрый старт

### 🎯 Vercel + Supabase (ПОЛНОСТЬЮ БЕСПЛАТНО!)

**Лучший бесплатный вариант!** Разверните frontend на Vercel, backend как serverless functions, базу данных на Supabase.

#### 🎁 Что бесплатно (навсегда, без кредитной карты):
- ✅ **Vercel**: Frontend + Serverless API (неограничено)
- ✅ **Supabase**: PostgreSQL (500MB) + Auth + Storage
- ✅ **Redis**: Встроенный в Supabase
- ✅ **Не засыпает** никогда
- ✅ **Неограниченный трафик**
- ✅ **Custom домены** бесплатно

#### 🚀 Пошаговое развертывание:

1. **Подготовьте SQL миграции:**
   ```bash
   # Извлеките SQL код из файлов:
   cat server/migrations/001-create-core-tables.js
   cat server/migrations/002-add-indexes.js
   cat server/seeders/001-seed-types.js
   cat server/seeders/002-seed-brands.js
   ```

2. **Supabase** (бесплатная PostgreSQL база):
   ```bash
   # 1. Регистрация: https://supabase.com
   # 2. Создайте новый проект
   # 3. Перейдите в SQL Editor
   # 4. Выполните SQL из шаг 1 (миграции + сиды)
   # 5. Скопируйте connection string из Settings > Database
   ```

3. **Vercel** (бесплатный hosting):
   ```bash
   # 1. Регистрация: https://vercel.com
   # 2. Connect GitHub repository
   # 3. Выберите проект - Vercel автоматически обнаружит vercel.json
   # 4. Настройте Environment Variables в Vercel Dashboard:
   #    VITE_API_URL=https://your-project.vercel.app
   #    (оставьте пустым для автоматического определения)
   # 5. Deploy автоматически!
   ```

4. **Проверьте развертывание:**
   - Frontend: `https://your-project.vercel.app`
   - API Health: `https://your-project.vercel.app/api/health`
   - Магазин: `https://your-project.vercel.app/shop`
   - **Примечание:** Пока подключена mock API. Для полной функциональности подключите Supabase.

### 🏠 Локальная разработка

#### 🚀 Быстрый старт с Docker:
```bash
git clone https://github.com/your-username/online-store.git
cd online-store
docker-compose up -d
npm run dev
```

#### 🔧 Ручная настройка:

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/your-username/online-store.git
   cd online-store
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте локальную базу данных:**
   ```bash
   # PostgreSQL + Redis через Docker
   docker run --name postgres-store -e POSTGRES_PASSWORD=password -e POSTGRES_DB=online_store -p 5432:5432 -d postgres:16
   docker run --name redis-store -p 6379:6379 -d redis:7-alpine

   # Или используйте Supabase локально
   npx supabase start
   ```

4. **Создайте .env файлы:**
   ```bash
   cp server/.env.example server/.env
   # Отредактируйте server/.env с вашими настройками
   ```

5. **Запустите миграции:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Запустите приложение:**
   ```bash
   npm run dev  # Клиент + сервер одновременно
   # или отдельно:
   npm run dev:client   # http://localhost:3000
   npm run dev:server   # http://localhost:10000
   ```

## 🏗️ Архитектура

Проект использует **монолитную архитектуру** с разделением на клиентскую и серверную части.

### Структура проекта
```
online-store/
├── client/              # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/              # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── migrations/      # SQL миграции для Supabase
│   ├── seeders/         # SQL сиды для Supabase
│   └── package.json
├── vercel.json          # Конфигурация Vercel
├── vercel/
│   └── api/             # Serverless API routes
│       ├── health.js
│       └── types.js
├── deploy-check.sh      # Скрипт проверки развертывания
├── docker-compose.yml   # Локальная разработка с Docker
├── package.json         # Workspaces конфигурация
└── README.md
```

### Архитектура развертывания
- **PostgreSQL** - основная база данных
- **Redis** - кэширование и сессии
- **API Server** - REST API (Node.js/Express)
- **Static Site** - React SPA с автоматическим проксированием API

## 🛠️ Технологии

### Frontend
- **React 19** - UI библиотека
- **Vite** - Сборщик и dev server
- **MobX** - State management
- **React Router** - Навигация
- **Bootstrap 5** - UI компоненты
- **Axios** - HTTP клиент

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Веб фреймворк
- **PostgreSQL** - База данных
- **Sequelize** - ORM
- **JWT** - Аутентификация
- **Swagger** - API документация

## 🔧 Инструменты развертывания

### Проверка готовности проекта

```bash
./deploy-check.sh
```

Скрипт проверит:
- Наличие всех необходимых файлов
- Корректность package.json файлов
- Наличие миграций и сидов
- Готовность к развертыванию на Vercel + Supabase

### Структура API

Проект использует **serverless functions** на Vercel:
- `vercel/api/health.js` - Health check endpoint
- `vercel/api/types.js` - Device types endpoint
- Все API routes в директории `vercel/api/`

### Переменные окружения

**Vercel Environment Variables:**
```bash
DATABASE_URL=postgresql://[supabase-connection-string]
SECRET_KEY=your-super-secret-key-minimum-32-chars
NODE_ENV=production
```

## 🔧 Инструменты развертывания

### Проверка готовности проекта

```bash
# Автоматическая проверка всех компонентов
   ./deploy-check.sh
```

Скрипт проверит:
- Наличие всех необходимых файлов
- Корректность package.json файлов
- Отсутствие захардкоженных секретов
- Готовность к развертыванию

### Мониторинг развертывания

После развертывания:
- **API Health**: `https://your-project.vercel.app/api/health`
- **Types API**: `https://your-project.vercel.app/api/types`
- **Клиент**: `https://your-project.vercel.app`

## 💰 Стоимость - ПОЛНОСТЬЮ БЕСПЛАТНО!

### 🎁 Vercel + Supabase (текущая настройка)
- **Frontend + API**: Неограничено (Vercel)
- **PostgreSQL**: 500MB бесплатно (Supabase)
- **Storage**: 1GB бесплатно (Supabase)
- **Bandwidth**: 50GB/месяц (Supabase)
- **Users**: 50,000 (Supabase)
- **Custom домены**: Бесплатно (Vercel)
- **SSL**: Автоматически (оба)

### 💎 Расширение (опционально)
При необходимости масштабирования:
- **Supabase Pro**: от $25/месяц (увеличенные лимиты)
- **Vercel Pro**: от $20/месяц (аналитика, больше функций)
- **Оба сервиса** имеют щедрые бесплатные лимиты для большинства проектов

## 📊 API Документация

### Локальная разработка
- **Health Check**: http://localhost:10000/health
- **Types API**: http://localhost:10000/api/types

### Production (Vercel)
- **Health Check**: `https://your-project.vercel.app/api/health`
- **Types API**: `https://your-project.vercel.app/api/types`

### Структура API
- `GET /api/health` - Проверка работоспособности
- `GET /api/types` - Список типов устройств
- Все endpoints доступны через Vercel serverless functions

## 🗄️ База данных

### Модели и связи

- **User** ↔ **Basket** (One-to-One)
- **User** ↔ **Rating** (One-to-Many)
- **Basket** ↔ **Device** (Many-to-Many через BasketDevice)
- **Type** ↔ **Device** (One-to-Many)
- **Brand** ↔ **Device** (One-to-Many)
- **Device** ↔ **Rating** (One-to-Many)
- **Device** ↔ **DeviceInfo** (One-to-Many)

### Миграции и сиды

```bash
# Запуск миграций
npm run migrate

# Откат миграций
npm run migrate:down

# Запуск сидов
npm run seed

# Откат сидов
npm run seed:down
```

## 🔧 Скрипты

### Корневые скрипты (workspaces)
```bash
npm run dev              # Клиент + сервер одновременно
npm run dev:client       # Только фронтенд (http://localhost:3000)
npm run dev:server       # Только бэкенд (http://localhost:10000)
npm run build            # Сборка фронтенда для продакшена
npm run start            # Запуск продакшена (сервер)
npm run test             # Тесты сервера
npm run lint             # Линтинг сервера
npm run format           # Форматирование всего кода
npm run db:migrate       # Миграции базы данных
npm run db:migrate:down  # Откат миграций
npm run db:seed          # Запуск сидирования
npm run db:seed:down     # Откат сидирования
```

### Серверные скрипты
```bash
cd server
npm run dev          # Разработка с nodemon + автоперезагрузка
npm run start        # Продакшен режим
npm run test         # Jest тесты
npm run lint         # ESLint проверка
npm run format       # Prettier форматирование
npm run migrate      # Запуск миграций
npm run migrate:down # Откат миграций
npm run seed         # Сидирование данных
npm run seed:down    # Откат сидирования
```

### Клиентские скрипты
```bash
cd client
npm run dev          # Vite dev server
npm run build        # Сборка для продакшена
npm run preview      # Предпросмотр сборки
npm run format       # Biome форматирование
```

### Скрипты развертывания
```bash
./deploy-check.sh    # Проверка готовности к развертыванию на Vercel + Supabase
```

## 🌍 Переменные окружения

### Локальная разработка

**Сервер (.env):**
```env
NODE_ENV=development
PORT=10000
SECRET_KEY=your-secret-key-minimum-10-chars
DATABASE_URL=postgres://user:pass@localhost:5432/online_store
DB_HOST=localhost
DB_PORT=5432
DB_NAME=online_store
DB_USER=postgres
DB_PASSWORD=password
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=http://localhost:3000
```

**Клиент (.env):**
```env
VITE_API_URL=http://localhost:10000
```

### Production (Vercel + Supabase)

Переменные окружения устанавливаются в Vercel Dashboard:

- **DATABASE_URL**: Connection string из Supabase
- **SECRET_KEY**: Случайная строка минимум 32 символа
- **NODE_ENV**: production (автоматически)

### Примеры значений

```bash
# Локально с Docker Compose
DATABASE_URL=postgres://store_user:store_password@localhost:5432/online_store
REDIS_URL=redis://localhost:6379

# Production на Vercel + Supabase
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SECRET_KEY=your-super-secret-key-minimum-32-characters-long
NODE_ENV=production
```

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm run test

# Тесты с покрытием
npm run test:coverage

# E2E тесты (если настроены)
npm run test:e2e
```

## 📝 Разработка

### Структура проекта
- `client/` - React приложение
- `server/` - Express API сервер
- `package.json` - Workspaces конфигурация

### Code Style
- **Frontend**: Biome для форматирования
- **Backend**: ESLint + Prettier
- **Commits**: Английский язык

### Best Practices
- Функциональные компоненты с хуками
- MobX для state management
- JSDoc комментарии
- Destructuring и современный синтаксис

## 🔄 Обновление приложения

### Автоматические обновления
При пуше в основную ветку Vercel автоматически:
1. Пересоберет frontend
2. Обновит serverless functions
3. Обновит приложение без downtime

### Миграции базы данных
Если вы добавили новые миграции:
1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Выполните новые миграции и сиды

### Ручное обновление
```bash
# В Vercel Dashboard:
# → Deployments → "Redeploy" (для принудительного обновления)
```

## 🔍 Troubleshooting

### Проблемы с развертыванием

**Сборка падает:**
- Проверьте логи в Vercel Dashboard
- Убедитесь, что все зависимости указаны в package.json
- Проверьте переменные окружения

**API не отвечает:**
```bash
# Проверьте health endpoint
curl https://your-project.vercel.app/api/health
```

**База данных недоступна:**
- Проверьте DATABASE_URL в Vercel
- Убедитесь, что миграции выполнены в Supabase
- Проверьте логи Vercel functions

**База данных недоступна:**
- Проверьте переменные окружения
- Убедитесь, что PostgreSQL сервис запущен
- Проверьте логи API сервера

### Локальная разработка

**Порт уже занят:**
```bash
# Убить процесс на порту
lsof -ti:10000 | xargs kill -9
npm run dev:server
```

**Проблемы с Docker:**
```bash
# Очистить и перезапустить
docker-compose down -v
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Требования к PR
- Код отформатирован (Biome для клиента, Prettier для сервера)
- Добавлены тесты при необходимости
- Обновлена документация
- Коммиты на английском языке

## 📄 Лицензия

ISC License - см. [LICENSE](LICENSE) файл.

## 🙏 Благодарности

- **Vercel** - за бесшовное развертывание frontend и serverless API
- **Supabase** - за мощную open-source базу данных и backend
- **Blueprint** - за автоматизацию развертывания
- Сообществу open source за все используемые библиотеки

---

**Автор:** darqus
**Контакты:** [GitHub](https://github.com/darqus)
**Развертывание:** Vercel + Supabase (БЕСПЛАТНО!)
**Статус:** Production Ready 🚀

## 🙏 Благодарности

- **Vercel** - за бесшовное развертывание frontend и serverless API
- **Supabase** - за мощную open-source базу данных и backend
- Сообществу open source за все используемые библиотеки
