# ===========================================
# Super Mario Whopper - Docker Makefile
# ===========================================

.PHONY: help build dev prod clean logs stop restart health

# Переменные
COMPOSE_FILE=docker-compose.yml
PROJECT_NAME=super-mario-whopper
REGISTRY?=localhost
VERSION?=latest

# Help команда по умолчанию
help:
	@echo "🍔 Super Mario Whopper - Docker Commands"
	@echo "========================================"
	@echo ""
	@echo "Основные команды:"
	@echo "  make dev          - Запуск в режиме разработки"
	@echo "  make prod         - Запуск в production режиме"
	@echo "  make build        - Сборка всех образов"
	@echo "  make clean        - Очистка контейнеров и образов"
	@echo "  make logs         - Просмотр логов"
	@echo "  make stop         - Остановка всех сервисов"
	@echo "  make restart      - Перезапуск сервисов"
	@echo "  make health       - Проверка здоровья сервисов"
	@echo ""
	@echo "Дополнительные команды:"
	@echo "  make nginx        - Запуск с Nginx"
	@echo "  make cache        - Запуск с Redis кэшем"
	@echo "  make proxy        - Запуск с Traefik proxy"
	@echo "  make shell        - Подключение к dev контейнеру"
	@echo "  make test         - Запуск тестов в контейнере"
	@echo ""

# Разработка
dev:
	@echo "🎮 Запуск Super Mario Whopper в режиме разработки..."
	docker compose -f $(COMPOSE_FILE) up --build super-mario-whopper-dev

# Production
prod:
	@echo "🍔 Запуск Super Mario Whopper в production режиме..."
	docker compose -f $(COMPOSE_FILE) up --build super-mario-whopper-prod

# Сборка образов
build:
	@echo "🔨 Сборка Docker образов..."
	docker compose -f $(COMPOSE_FILE) build

# Сборка отдельных этапов
build-dev:
	@echo "🔨 Сборка dev образа..."
	docker build --target development -t $(PROJECT_NAME):dev .

build-prod:
	@echo "🔨 Сборка production образа..."
	docker build --target production -t $(PROJECT_NAME):prod .

build-nginx:
	@echo "🔨 Сборка nginx образа..."
	docker build --target nginx -t $(PROJECT_NAME):nginx .

# Запуск с профилями
nginx:
	@echo "🌐 Запуск с Nginx..."
	docker compose -f $(COMPOSE_FILE) --profile nginx up --build

cache:
	@echo "💾 Запуск с Redis кэшем..."
	docker compose -f $(COMPOSE_FILE) --profile cache up --build

proxy:
	@echo "🔗 Запуск с Traefik proxy..."
	docker compose -f $(COMPOSE_FILE) --profile proxy up --build

# Полный стек
full:
	@echo "🚀 Запуск полного стека..."
	docker compose -f $(COMPOSE_FILE) --profile nginx --profile cache --profile proxy up --build

# Логи
logs:
	docker compose -f $(COMPOSE_FILE) logs -f

logs-dev:
	docker compose -f $(COMPOSE_FILE) logs -f super-mario-whopper-dev

logs-prod:
	docker compose -f $(COMPOSE_FILE) logs -f super-mario-whopper-prod

# Остановка
stop:
	@echo "🛑 Остановка всех сервисов..."
	docker compose -f $(COMPOSE_FILE) down

# Перезапуск
restart:
	@echo "🔄 Перезапуск сервисов..."
	docker compose -f $(COMPOSE_FILE) restart

# Health check
health:
	@echo "🏥 Проверка здоровья сервисов..."
	@echo "Development (порт 3000):"
	@curl -f http://localhost:3000/api/health 2>/dev/null || echo "❌ Dev сервис недоступен"
	@echo ""
	@echo "Production (порт 3001):"
	@curl -f http://localhost:3001/api/health 2>/dev/null || echo "❌ Prod сервис недоступен"
	@echo ""
	@echo "Nginx (порт 8080):"
	@curl -f http://localhost:8080/health 2>/dev/null || echo "❌ Nginx недоступен"

# Очистка
clean:
	@echo "🧹 Очистка Docker ресурсов..."
	docker compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	docker system prune -f

clean-all:
	@echo "🧹 Полная очистка Docker..."
	docker compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	docker system prune -af --volumes

# Shell доступ
shell:
	@echo "🐚 Подключение к dev контейнеру..."
	docker compose -f $(COMPOSE_FILE) exec super-mario-whopper-dev sh

shell-prod:
	@echo "🐚 Подключение к prod контейнеру..."
	docker compose -f $(COMPOSE_FILE) exec super-mario-whopper-prod sh

# Тестирование
test:
	@echo "🧪 Запуск тестов..."
	docker build --target test -t $(PROJECT_NAME):test .

# Инспекция
inspect:
	@echo "🔍 Информация о контейнерах..."
	docker compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "🔍 Информация о сети..."
	docker network ls | grep burger-king

# Мониторинг
stats:
	@echo "📊 Статистика использования ресурсов..."
	docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"

# Экспорт образов
export:
	@echo "📦 Экспорт образов..."
	docker save -o super-mario-whopper-images.tar \
		$(PROJECT_NAME):dev \
		$(PROJECT_NAME):prod \
		$(PROJECT_NAME):nginx

# Импорт образов
import:
	@echo "📥 Импорт образов..."
	docker load -i super-mario-whopper-images.tar

# Deploy команды (для production)
deploy-prod:
	@echo "🚀 Развертывание в production..."
	docker compose -f $(COMPOSE_FILE) -f docker-compose.prod.yml up -d --build super-mario-whopper-prod

# Backup томов
backup:
	@echo "💾 Создание резервной копии..."
	docker run --rm \
		-v super-mario-whopper-redis-data:/backup-source \
		-v $(PWD)/backups:/backup-dest \
		alpine tar czf /backup-dest/redis-backup-$(shell date +%Y%m%d-%H%M%S).tar.gz -C /backup-source .

# Информация о системе
info:
	@echo "ℹ️ Системная информация:"
	@echo "Docker версия: $(shell docker --version)"
	@echo "Docker Compose версия: $(shell docker compose --version)"
	@echo "Проект: $(PROJECT_NAME)"
	@echo "Файл Compose: $(COMPOSE_FILE)"
	@echo ""
	@echo "🎮 Super Mario Whopper готов к запуску!"
	@echo "Выполните 'make dev' для разработки или 'make prod' для production" 