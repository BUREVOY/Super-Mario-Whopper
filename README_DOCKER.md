# 🐳 Super Mario Whopper - Docker Documentation

## 🍔 Обзор

Super Mario Whopper полностью контейнеризовано с использованием Docker и Docker Compose. Поддерживаются режимы разработки и production с дополнительными сервисами для масштабирования.

## 🏗 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    Super Mario Whopper                      │
├─────────────────────────────────────────────────────────────┤
│  🎮 Development    │  🍔 Production    │  🌐 Nginx Static   │
│  Port: 3000        │  Port: 3001       │  Port: 8080         │
│  Hot Reload ✅     │  Optimized ✅     │  Static Files ✅    │
├─────────────────────────────────────────────────────────────┤
│  💾 Redis Cache    │  🔗 Traefik       │  📊 Health Checks  │
│  Port: 6379        │  Ports: 80,443    │  /api/health        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Быстрый старт

### Предварительные требования

- Docker 20.10+
- Docker Compose 2.0+
- Make (опционально, для удобства)

### Установка и запуск

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd super-mario-whopper

# Запуск в режиме разработки
make dev
# или
docker compose up --build super-mario-whopper-dev

# Запуск в production режиме
make prod
# или
docker compose up --build super-mario-whopper-prod
```

## 📝 Доступные команды

### Основные команды Make

```bash
make help          # Показать все доступные команды
make dev           # Запуск в режиме разработки
make prod          # Запуск в production режиме
make build         # Сборка всех образов
make clean         # Очистка контейнеров и образов
make logs          # Просмотр логов
make health        # Проверка здоровья сервисов
```

### Дополнительные команды

```bash
make nginx         # Запуск с Nginx
make cache         # Запуск с Redis кэшем
make proxy         # Запуск с Traefik proxy
make full          # Запуск полного стека
make shell         # Подключение к dev контейнеру
make stats         # Статистика использования ресурсов
```

## 🐳 Dockerfile этапы

### 1. Base - Базовый образ

- Node.js 20 Alpine
- Установка npm и зависимостей

### 2. Development - Разработка

- Все зависимости (включая dev)
- Hot reload
- Отладка
- Порт: 3000

### 3. Production - Продакшн

- Только runtime зависимости
- Оптимизированная сборка
- Security hardening
- Порт: 3000

### 4. Nginx - Статические файлы

- Nginx unprivileged
- Gzip сжатие
- Кэширование
- Порт: 8080

## 🔧 Конфигурация

### Environment Variables

```bash
# Next.js настройки
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000

# Игровые настройки
GAME_WIDTH=1024
GAME_HEIGHT=768
GAME_GRAVITY=800

# Burger King брендинг
BK_BRAND_NAME="Burger King"
BK_SLOGAN="Taste is King!"

# Redis (опционально)
REDIS_URL=redis://redis:6379
REDIS_PREFIX=super_mario_whopper
```

### Порты

| Сервис      | Порт          | Описание                |
| ----------- | ------------- | ----------------------- |
| Development | 3000          | Dev сервер с hot reload |
| Production  | 3001          | Оптимизированный сервер |
| Nginx       | 8080          | Статические файлы       |
| Redis       | 6379          | Кэш (опционально)       |
| Traefik     | 80, 443, 8081 | Proxy и dashboard       |

## 🔍 Мониторинг и отладка

### Health Checks

```bash
# Проверка всех сервисов
make health

# Ручная проверка
curl http://localhost:3000/api/health  # Development
curl http://localhost:3001/api/health  # Production
curl http://localhost:8080/health      # Nginx
```

### Логи

```bash
# Все логи
make logs

# Конкретный сервис
make logs-dev
make logs-prod
docker compose logs super-mario-whopper-dev
```

### Статистика ресурсов

```bash
make stats
docker stats
```

## 🏭 Production развертывание

### Docker Compose для production

```yaml
# docker-compose.prod.yml
version: "3.8"

services:
  super-mario-whopper-prod:
    build:
      context: .
      target: production
    environment:
      - NODE_ENV=production
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: "0.5"
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Развертывание

```bash
# Production развертывание
make deploy-prod

# С полным стеком
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📊 Профили сервисов

### Nginx (статические файлы)

```bash
docker compose --profile nginx up --build
```

### Redis (кэширование)

```bash
docker compose --profile cache up --build
```

### Traefik (reverse proxy)

```bash
docker compose --profile proxy up --build
```

### Полный стек

```bash
make full
# или
docker compose --profile nginx --profile cache --profile proxy up --build
```

## 🛡 Безопасность

### Dockerfile Security Features

- ✅ Non-root пользователь (nextjs:nodejs)
- ✅ Multi-stage builds для минимального размера
- ✅ Minimal base image (Alpine Linux)
- ✅ Security headers в Nginx
- ✅ Health checks для отказоустойчивости

### Nginx Security Headers

```nginx
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
X-Powered-By: Burger King - Taste is King!
```

## 📦 Образы и размеры

| Образ       | Размер | Описание                      |
| ----------- | ------ | ----------------------------- |
| Base        | ~50MB  | Node.js Alpine + dependencies |
| Development | ~200MB | С dev зависимостями           |
| Production  | ~80MB  | Оптимизированный              |
| Nginx       | ~25MB  | Только статические файлы      |

## 🔄 CI/CD Integration

### GitHub Actions пример

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker images
        run: |
          docker build --target production -t super-mario-whopper:prod .
          docker build --target nginx -t super-mario-whopper:nginx .

      - name: Run tests
        run: |
          docker build --target test -t super-mario-whopper:test .

      - name: Deploy to production
        run: |
          docker compose -f docker-compose.prod.yml up -d
```

## 🔧 Настройка для разработки

### Bind mounts для hot reload

```yaml
volumes:
  - .:/app # Исходный код
  - /app/node_modules # Исключаем node_modules
  - /app/.next # Исключаем .next
```

### Debug режим

```bash
# Подключение к контейнеру
make shell
docker compose exec super-mario-whopper-dev sh

# Просмотр процессов
docker compose exec super-mario-whopper-dev ps aux

# Просмотр переменных окружения
docker compose exec super-mario-whopper-dev env
```

## 📋 Устранение проблем

### Частые проблемы

#### 1. Контейнер не запускается

```bash
# Проверить логи
make logs-dev
docker compose logs super-mario-whopper-dev

# Проверить образ
docker images | grep super-mario-whopper

# Пересобрать
make clean && make build
```

#### 2. Порт уже используется

```bash
# Найти процесс
netstat -tulpn | grep :3000
lsof -i :3000

# Изменить порт в docker-compose.yml
ports:
  - "3002:3000"  # Внешний порт 3002
```

#### 3. Проблемы с правами файлов

```bash
# Проверить пользователя в контейнере
docker compose exec super-mario-whopper-dev whoami

# Исправить права (если нужно)
sudo chown -R $USER:$USER .
```

#### 4. Out of memory

```bash
# Увеличить лимиты
docker compose exec super-mario-whopper-dev sh -c 'echo "memory limit: $(cat /sys/fs/cgroup/memory/memory.limit_in_bytes)"'

# В docker-compose.yml добавить:
deploy:
  resources:
    limits:
      memory: 1G
```

## 🧹 Очистка

### Очистка Docker ресурсов

```bash
# Остановка и удаление контейнеров
make clean

# Полная очистка (включая volumes)
make clean-all

# Очистка системы Docker
docker system prune -af --volumes
```

### Резервное копирование

```bash
# Создание backup
make backup

# Экспорт образов
make export

# Импорт образов
make import
```

## 📈 Производительность

### Оптимизации

1. **Multi-stage builds** - Минимальный размер образов
2. **Layer caching** - Быстрая пересборка
3. **Bind mounts** - Горячая перезагрузка в dev
4. **Gzip compression** - Сжатие статических файлов
5. **Health checks** - Быстрое обнаружение проблем

### Мониторинг

```bash
# Использование ресурсов
make stats

# Детальная информация
docker inspect super-mario-whopper-dev

# Логи производительности
docker compose logs super-mario-whopper-prod | grep -i "performance\|memory\|cpu"
```

## 🌐 Сетевые настройки

### Docker Networks

```bash
# Информация о сети
docker network ls | grep burger-king
docker network inspect burger-king-network

# Подключение к сети
docker network connect burger-king-network my-container
```

### Service Discovery

```yaml
# Сервисы могут обращаться друг к другу по имени
services:
  app:
    # ...
  redis:
    # ...
# В приложении:
# redis://redis:6379
```

## 🔗 Интеграции

### Load Balancer (Traefik)

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.whopper.rule=Host(`whopper.localhost`)"
  - "traefik.http.services.whopper.loadbalancer.server.port=3000"
```

### SSL/TLS

```yaml
# В Traefik
labels:
  - "traefik.http.routers.whopper-secure.entrypoints=websecure"
  - "traefik.http.routers.whopper-secure.tls=true"
```

## 🎯 Рекомендации

### Для разработки

- Используйте `make dev` для быстрого старта
- Подключайтесь к контейнеру через `make shell`
- Следите за логами через `make logs-dev`

### Для production

- Всегда используйте конкретные версии образов
- Настройте health checks
- Используйте secrets для чувствительных данных
- Мониторьте ресурсы

### Для CI/CD

- Кэшируйте слои Docker
- Запускайте тесты в контейнерах
- Используйте multi-stage builds

---

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `make logs`
2. Проверьте health: `make health`
3. Проверьте ресурсы: `make stats`
4. Очистите и пересоберите: `make clean && make build`

**Happy Gaming with Docker! 🍔🎮🐳**
