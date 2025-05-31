# syntax=docker/dockerfile:1

# Аргументы для версий
ARG NODE_VERSION=20-alpine
ARG NGINX_VERSION=alpine3.21

# =========================================
# Этап 1: Базовый образ
# =========================================
FROM node:${NODE_VERSION} AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы пакетов для кэширования зависимостей
COPY package.json package-lock.json* ./

# Устанавливаем глобальные зависимости
RUN npm install -g npm@latest

# =========================================
# Этап 2: Установка зависимостей для разработки
# =========================================
FROM base AS dev-deps

# Устанавливаем все зависимости (включая dev)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

# =========================================
# Этап 3: Установка зависимостей для production
# =========================================
FROM base AS prod-deps

# Устанавливаем только production зависимости
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# =========================================
# Этап 4: Разработка
# =========================================
FROM base AS development

# Копируем dev зависимости
COPY --from=dev-deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Открываем порт для dev сервера
EXPOSE 3000

# Устанавливаем переменную окружения
ENV NODE_ENV=development

# Команда для запуска dev сервера
CMD ["npm", "run", "dev"]

# =========================================
# Этап 5: Сборка для production
# =========================================
FROM base AS builder

# Копируем все зависимости (включая dev для сборки)
COPY --from=dev-deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Устанавливаем переменные окружения для сборки
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Сборка приложения
RUN npm run build

# =========================================
# Этап 6: Production
# =========================================
FROM node:${NODE_VERSION} AS production

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Создаем пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем файлы package.json
COPY package.json package-lock.json* ./

# Устанавливаем только runtime зависимости
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev && npm cache clean --force

# Копируем собранное приложение
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Команда запуска
CMD ["node", "server.js"]

# =========================================
# Этап 7: Nginx для статической раздачи (альтернатива)
# =========================================
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS nginx

# Копируем статические файлы
COPY --from=builder /app/out /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Пользователь nginx для безопасности
USER nginx

# Открываем порт 8080 (nginx unprivileged)
EXPOSE 8080

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"] 