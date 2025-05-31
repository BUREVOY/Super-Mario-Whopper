@echo off
REM ===========================================
REM Super Mario Whopper - Docker Commands (Windows)
REM ===========================================

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="dev" goto dev
if "%1"=="prod" goto prod
if "%1"=="build" goto build
if "%1"=="clean" goto clean
if "%1"=="logs" goto logs
if "%1"=="health" goto health
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="shell" goto shell
if "%1"=="info" goto info
goto help

:help
echo.
echo 🍔 Super Mario Whopper - Docker Commands
echo ========================================
echo.
echo Основные команды:
echo   docker-commands.bat dev          - Запуск в режиме разработки
echo   docker-commands.bat prod         - Запуск в production режиме
echo   docker-commands.bat build        - Сборка всех образов
echo   docker-commands.bat clean        - Очистка контейнеров и образов
echo   docker-commands.bat logs         - Просмотр логов
echo   docker-commands.bat stop         - Остановка всех сервисов
echo   docker-commands.bat restart      - Перезапуск сервисов
echo   docker-commands.bat health       - Проверка здоровья сервисов
echo   docker-commands.bat shell        - Подключение к dev контейнеру
echo   docker-commands.bat info         - Информация о системе
echo.
echo Примеры:
echo   docker-commands.bat dev          (для разработки)
echo   docker-commands.bat prod         (для production)
echo.
goto end

:dev
echo 🎮 Запуск Super Mario Whopper в режиме разработки...
docker compose up --build super-mario-whopper-dev
goto end

:prod
echo 🍔 Запуск Super Mario Whopper в production режиме...
docker compose up --build super-mario-whopper-prod
goto end

:build
echo 🔨 Сборка Docker образов...
docker compose build
goto end

:clean
echo 🧹 Очистка Docker ресурсов...
docker compose down --rmi all --volumes --remove-orphans
docker system prune -f
goto end

:logs
echo 📋 Просмотр логов...
docker compose logs -f
goto end

:health
echo 🏥 Проверка здоровья сервисов...
echo Development (порт 3000):
curl -f http://localhost:3000/api/health 2>nul || echo ❌ Dev сервис недоступен
echo.
echo Production (порт 3001):
curl -f http://localhost:3001/api/health 2>nul || echo ❌ Prod сервис недоступен
echo.
echo Nginx (порт 8080):
curl -f http://localhost:8080/health 2>nul || echo ❌ Nginx недоступен
goto end

:stop
echo 🛑 Остановка всех сервисов...
docker compose down
goto end

:restart
echo 🔄 Перезапуск сервисов...
docker compose restart
goto end

:shell
echo 🐚 Подключение к dev контейнеру...
docker compose exec super-mario-whopper-dev sh
goto end

:info
echo ℹ️ Системная информация:
docker --version
docker compose version
echo.
echo Проект: Super Mario Whopper
echo Файл Compose: docker-compose.yml
echo.
echo 🎮 Super Mario Whopper готов к запуску!
echo Выполните 'docker-commands.bat dev' для разработки
echo или 'docker-commands.bat prod' для production
goto end

:end 