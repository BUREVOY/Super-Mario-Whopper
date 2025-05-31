"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameStatsProps {
  className?: string;
}

interface Stats {
  gamesPlayed: number;
  highScore: number;
  totalScore: number;
  enemiesDefeated: number;
  powerUpsCollected: number;
  timePlayedMinutes: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_game",
    name: "Первая игра",
    description: "Сыграйте свою первую игру",
    icon: "🎮",
    unlocked: false,
  },
  {
    id: "score_1000",
    name: "Тысячник",
    description: "Наберите 1000 очков",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "enemy_hunter",
    name: "Охотник на фастфуд",
    description: "Победите 50 врагов",
    icon: "🍔",
    unlocked: false,
  },
  {
    id: "power_collector",
    name: "Коллекционер бонусов",
    description: "Соберите 25 бонусов",
    icon: "👑",
    unlocked: false,
  },
  {
    id: "time_master",
    name: "Мастер времени",
    description: "Играйте 30 минут",
    icon: "⏰",
    unlocked: false,
  },
  {
    id: "high_scorer",
    name: "Рекордсмен",
    description: "Наберите 5000 очков",
    icon: "🌟",
    unlocked: false,
  },
];

export default function GameStats({ className = "" }: GameStatsProps) {
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    highScore: 0,
    totalScore: 0,
    enemiesDefeated: 0,
    powerUpsCollected: 0,
    timePlayedMinutes: 0,
    achievements: ACHIEVEMENTS,
  });

  const [isVisible, setIsVisible] = useState(false);

  // Загрузка статистики из localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem("super_mario_whopper_stats");
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStats((prevStats) => ({
          ...prevStats,
          ...parsedStats,
          achievements: ACHIEVEMENTS.map((achievement) => {
            const saved = parsedStats.achievements?.find(
              (a: Achievement) => a.id === achievement.id
            );
            return saved ? { ...achievement, ...saved } : achievement;
          }),
        }));
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
      }
    }
  }, []);

  // Сохранение статистики в localStorage
  const saveStats = (newStats: Stats) => {
    localStorage.setItem("super_mario_whopper_stats", JSON.stringify(newStats));
    setStats(newStats);
  };

  // Проверка достижений
  const checkAchievements = (newStats: Stats) => {
    const updatedAchievements = newStats.achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;
      switch (achievement.id) {
        case "first_game":
          shouldUnlock = newStats.gamesPlayed >= 1;
          break;
        case "score_1000":
          shouldUnlock = newStats.highScore >= 1000;
          break;
        case "enemy_hunter":
          shouldUnlock = newStats.enemiesDefeated >= 50;
          break;
        case "power_collector":
          shouldUnlock = newStats.powerUpsCollected >= 25;
          break;
        case "time_master":
          shouldUnlock = newStats.timePlayedMinutes >= 30;
          break;
        case "high_scorer":
          shouldUnlock = newStats.highScore >= 5000;
          break;
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date(),
        };
      }

      return achievement;
    });

    return { ...newStats, achievements: updatedAchievements };
  };

  // Обновление статистики (вызывается из игры)
  const updateStats = (gameStats: Partial<Stats>) => {
    const newStats = checkAchievements({
      ...stats,
      ...gameStats,
    });
    saveStats(newStats);
  };

  // Экспортируем функцию обновления статистики для использования в игре
  (
    window as unknown as { updateGameStats?: typeof updateStats }
  ).updateGameStats = updateStats;

  // Сброс статистики
  const resetStats = () => {
    const resetStats: Stats = {
      gamesPlayed: 0,
      highScore: 0,
      totalScore: 0,
      enemiesDefeated: 0,
      powerUpsCollected: 0,
      timePlayedMinutes: 0,
      achievements: ACHIEVEMENTS,
    };
    saveStats(resetStats);
  };

  const unlockedAchievements = stats.achievements.filter((a) => a.unlocked);
  const achievementProgress =
    (unlockedAchievements.length / ACHIEVEMENTS.length) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Кнопка показать/скрыть статистику */}
      <div className="text-center">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          {isVisible ? "📊 Скрыть статистику" : "📊 Показать статистику"}
        </button>
      </div>

      {isVisible && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Основная статистика */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                📈 Основная статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Игр сыграно:</span>
                <Badge variant="secondary">{stats.gamesPlayed}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Рекорд очков:</span>
                <Badge variant="default">
                  {stats.highScore.toLocaleString()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Всего очков:</span>
                <Badge variant="outline">
                  {stats.totalScore.toLocaleString()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Время игры:</span>
                <Badge variant="secondary">{stats.timePlayedMinutes} мин</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Боевая статистика */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                ⚔️ Боевая статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Врагов побеждено:</span>
                <Badge variant="destructive">{stats.enemiesDefeated}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Бонусов собрано:</span>
                <Badge variant="default">{stats.powerUpsCollected}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Средний счёт:</span>
                <Badge variant="outline">
                  {stats.gamesPlayed > 0
                    ? Math.round(stats.totalScore / stats.gamesPlayed)
                    : 0}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-red-800">
                🏆 Достижения
                <Badge variant="outline">
                  {unlockedAchievements.length}/{ACHIEVEMENTS.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогресс</span>
                  <span>{Math.round(achievementProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${achievementProgress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-2 rounded ${
                      achievement.unlocked
                        ? "bg-green-100 border border-green-300"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <span className="text-2xl mr-3">{achievement.icon}</span>
                    <div className="flex-1">
                      <div
                        className={`font-semibold ${
                          achievement.unlocked
                            ? "text-green-800"
                            : "text-gray-600"
                        }`}
                      >
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.description}
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-green-600">
                          Получено:{" "}
                          {new Date(
                            achievement.unlockedAt
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Кнопка сброса статистики */}
      {isVisible && (
        <div className="text-center">
          <button
            onClick={resetStats}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition-colors"
          >
            🗑️ Сбросить статистику
          </button>
        </div>
      )}
    </div>
  );
}
