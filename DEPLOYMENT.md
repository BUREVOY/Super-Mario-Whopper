# 🚀 Развертывание Super Mario Whopper

Инструкции по развертыванию 2D платформера Super Mario Whopper на различных платформах.

## 📋 Предварительные требования

- Node.js 18+
- npm или yarn
- Git

## 🛠️ Локальная разработка

### 1. Клонирование и установка

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd super_mario_whopper

# Установите зависимости
npm install

# Запустите в режиме разработки
npm run dev
```

### 2. Структура проекта

```
super_mario_whopper/
├── app/                    # Next.js App Router
├── components/             # React компоненты
├── lib/                    # Игровая логика и утилиты
├── types/                  # TypeScript типы
├── public/assets/          # Игровые ассеты
├── .cursorrules           # Правила разработки
└── components.json        # Конфигурация shadcn/ui
```

## 🌐 Развертывание на Vercel (Рекомендуется)

### Автоматическое развертывание

1. **Подключите репозиторий к Vercel:**

   - Зайдите на [vercel.com](https://vercel.com)
   - Нажмите "New Project"
   - Импортируйте ваш Git репозиторий

2. **Настройки проекта:**

   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Переменные окружения:**

   ```
   NODE_ENV=production
   ```

4. **Развертывание:**
   - Vercel автоматически развернет проект
   - Каждый push в main ветку будет автоматически развертываться

### Ручное развертывание

```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Разверните проект
vercel --prod
```

## 🐳 Развертывание с Docker

### 1. Создание Docker образа

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Сборка и запуск

```bash
# Сборка образа
docker build -t super-mario-whopper .

# Запуск контейнера
docker run -p 3000:3000 super-mario-whopper
```

## ☁️ Развертывание на Netlify

### 1. Настройка сборки

Создайте файл `netlify.toml`:

```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2. Развертывание

1. Подключите репозиторий к Netlify
2. Настройте команды сборки:
   - Build command: `npm run build`
   - Publish directory: `.next`

## 🚀 Развертывание на Railway

### 1. Подключение репозитория

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Войдите в аккаунт
railway login

# Инициализируйте проект
railway init

# Разверните
railway up
```

### 2. Настройки

- Railway автоматически определит Next.js проект
- Настройте переменные окружения в панели управления

## 📱 Оптимизация для продакшена

### 1. Настройки Next.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```

### 2. Оптимизация ассетов

```bash
# Сжатие изображений
npm install -g imagemin-cli
imagemin public/assets/**/*.png --out-dir=public/assets/optimized

# Сжатие звуков
npm install -g audiosprite
audiosprite public/assets/sounds/*.wav --output public/assets/sounds/sprite
```

### 3. Настройки производительности

- Включите gzip сжатие
- Настройте CDN для статических файлов
- Используйте Service Worker для кеширования

## 🔧 Переменные окружения

### Разработка (.env.local)

```env
NODE_ENV=development
NEXT_PUBLIC_GAME_DEBUG=true
```

### Продакшен (.env.production)

```env
NODE_ENV=production
NEXT_PUBLIC_GAME_DEBUG=false
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 📊 Мониторинг

### 1. Аналитика

```javascript
// lib/analytics.ts
export const trackGameEvent = (event: string, data: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event, data);
  }
};
```

### 2. Логирование ошибок

```javascript
// lib/errorTracking.ts
export const logError = (error: Error, context: string) => {
  console.error(`[${context}]`, error);

  // Отправка в сервис мониторинга
  if (process.env.NODE_ENV === "production") {
    // Sentry, LogRocket, etc.
  }
};
```

## 🔒 Безопасность

### 1. Заголовки безопасности

```javascript
// next.config.js
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

### 2. CSP (Content Security Policy)

```javascript
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self';
`;
```

## 🧪 Тестирование перед развертыванием

```bash
# Сборка проекта
npm run build

# Запуск продакшен версии локально
npm start

# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Тесты (если есть)
npm test
```

## 📝 Чек-лист развертывания

- [ ] Все зависимости установлены
- [ ] Проект собирается без ошибок
- [ ] Настроены переменные окружения
- [ ] Оптимизированы ассеты
- [ ] Настроен мониторинг
- [ ] Проверена безопасность
- [ ] Настроен домен (если нужно)
- [ ] Настроен SSL сертификат
- [ ] Проверена производительность

## 🆘 Устранение неполадок

### Проблемы с Phaser

```javascript
// Если Phaser не загружается в продакшене
if (typeof window !== "undefined") {
  const Phaser = require("phaser");
  // Инициализация игры
}
```

### Проблемы с SSR

```javascript
// Используйте dynamic import для клиентских компонентов
const GameComponent = dynamic(() => import("./Game"), {
  ssr: false,
});
```

### Проблемы с памятью

```javascript
// Очистка ресурсов при размонтировании
useEffect(() => {
  return () => {
    if (gameInstance) {
      gameInstance.destroy(true);
    }
  };
}, []);
```

---

**Удачного развертывания! 🚀🍔**
