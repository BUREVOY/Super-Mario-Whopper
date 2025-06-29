# 🔧 Устранение неполадок - Super Mario Whopper

## Проблема: Бесконечная загрузка игры

### Симптомы

- Игра показывает "🍔 Загрузка Super Mario Whopper..." и не переходит к меню
- В консоли видны сообщения о загрузке текстур, но переход к игре не происходит
- Сообщения типа "🍔 Super Mario Whopper загружен!" и "🍔 Super Mario Whopper остановлен"

### Причины

1. Ошибка в MenuScene при создании элементов интерфейса
2. Проблемы с загрузкой текстур фона
3. Конфликт между сценами

### Решения

#### Быстрое решение

1. Откройте консоль разработчика (F12)
2. Найдите кнопку "НАЧАТЬ ИГРУ" на экране загрузки
3. Нажмите на неё для прямого перехода к игре

#### Автоматическое решение

- Игра автоматически перейдет к игровой сцене через 5 секунд, если меню не загрузится

#### Отладка

Проверьте консоль на наличие следующих сообщений:

```
🎯 PreloadScene: Все ресурсы загружены, переходим к MenuScene...
🎯 Доступные сцены: [список сцен]
🎯 Запускаем переход к MenuScene...
🎮 MenuScene: Сцена меню запущена!
```

Если сообщения останавливаются на определенном этапе, это поможет определить проблему.

### Дополнительные проверки

#### Проверка текстур

В консоли должны быть сообщения:

```
✅ player - загружен
✅ burger - загружен
✅ bk_background - загружен
```

#### Проверка сцен

```javascript
// В консоли разработчика
console.log(window.game?.scene?.scenes?.map((s) => s.scene.key));
```

### Если проблема не решается

1. Обновите страницу (Ctrl+F5)
2. Очистите кэш браузера
3. Проверьте, что все файлы ассетов загружены корректно
4. Убедитесь, что нет ошибок JavaScript в консоли

### Контакты для поддержки

Если проблема продолжается, создайте issue с:

- Скриншотом консоли
- Информацией о браузере
- Описанием действий, которые привели к проблеме
