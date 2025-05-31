// Система событий для связи между игрой и UI
type EventCallback<T = unknown> = (data?: T) => void;

class GameEventManager {
  private listeners: { [key: string]: EventCallback[] } = {};

  // Подписка на событие
  on<T = unknown>(event: string, callback: EventCallback<T>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback as EventCallback);
  }

  // Отписка от события
  off<T = unknown>(event: string, callback: EventCallback<T>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(
      (cb) => cb !== callback
    );
  }

  // Отправка события
  emit<T = unknown>(event: string, data?: T) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback(data));
  }

  // Очистка всех слушателей
  clear() {
    this.listeners = {};
  }
}

// Глобальный экземпляр менеджера событий
export const gameEvents = new GameEventManager();

// Типы игровых событий
export interface GameEventData {
  // События игры
  gameStart: { timestamp: number };
  gameEnd: {
    score: number;
    enemiesDefeated: number;
    powerUpsCollected: number;
    timePlayedSeconds: number;
  };
  gamePause: { timestamp: number };
  gameResume: { timestamp: number };

  // События игрока
  playerDamage: { health: number; timestamp: number };
  playerDeath: { timestamp: number };
  playerRespawn: { timestamp: number };

  // События врагов
  enemyDefeated: {
    enemyType: string;
    score: number;
    position: { x: number; y: number };
    timestamp: number;
  };

  // События бонусов
  powerUpCollected: {
    powerUpType: string;
    score: number;
    position: { x: number; y: number };
    timestamp: number;
  };

  // События очков
  scoreChanged: {
    newScore: number;
    scoreIncrease: number;
    timestamp: number;
  };

  // События уровня
  levelComplete: {
    level: number;
    score: number;
    timeSeconds: number;
    timestamp: number;
  };
  levelStart: {
    level: number;
    timestamp: number;
  };
}

// Хелперы для отправки событий
export const emitGameEvent = {
  gameStart: () => gameEvents.emit("gameStart", { timestamp: Date.now() }),

  gameEnd: (
    score: number,
    enemiesDefeated: number,
    powerUpsCollected: number,
    timePlayedSeconds: number
  ) =>
    gameEvents.emit("gameEnd", {
      score,
      enemiesDefeated,
      powerUpsCollected,
      timePlayedSeconds,
      timestamp: Date.now(),
    }),

  gamePause: () => gameEvents.emit("gamePause", { timestamp: Date.now() }),

  gameResume: () => gameEvents.emit("gameResume", { timestamp: Date.now() }),

  playerDamage: (health: number) =>
    gameEvents.emit("playerDamage", { health, timestamp: Date.now() }),

  playerDeath: () => gameEvents.emit("playerDeath", { timestamp: Date.now() }),

  playerRespawn: () =>
    gameEvents.emit("playerRespawn", { timestamp: Date.now() }),

  enemyDefeated: (
    enemyType: string,
    score: number,
    position: { x: number; y: number }
  ) =>
    gameEvents.emit("enemyDefeated", {
      enemyType,
      score,
      position,
      timestamp: Date.now(),
    }),

  powerUpCollected: (
    powerUpType: string,
    score: number,
    position: { x: number; y: number }
  ) =>
    gameEvents.emit("powerUpCollected", {
      powerUpType,
      score,
      position,
      timestamp: Date.now(),
    }),

  scoreChanged: (newScore: number, scoreIncrease: number) =>
    gameEvents.emit("scoreChanged", {
      newScore,
      scoreIncrease,
      timestamp: Date.now(),
    }),

  levelComplete: (level: number, score: number, timeSeconds: number) =>
    gameEvents.emit("levelComplete", {
      level,
      score,
      timeSeconds,
      timestamp: Date.now(),
    }),

  levelStart: (level: number) =>
    gameEvents.emit("levelStart", { level, timestamp: Date.now() }),
};

// Хук для использования в React компонентах
export const useGameEvents = () => {
  return {
    on: gameEvents.on.bind(gameEvents),
    off: gameEvents.off.bind(gameEvents),
    emit: gameEvents.emit.bind(gameEvents),
    emitGameEvent,
  };
};
