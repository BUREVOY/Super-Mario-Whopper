"use client";

import { useState, useEffect } from "react";
import { useGameEvents } from "@/lib/gameEvents";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AchievementNotificationProps {
  className?: string;
}

export default function AchievementNotification({
  className = "",
}: AchievementNotificationProps) {
  const [notifications, setNotifications] = useState<Achievement[]>([]);
  const { on, off } = useGameEvents();

  useEffect(() => {
    // Слушаем события достижений
    const handleAchievementUnlocked = (achievement: Achievement) => {
      setNotifications((prev) => [...prev, achievement]);

      // Автоматически убираем уведомление через 5 секунд
      setTimeout(() => {
        setNotifications((prev) => prev.filter((a) => a.id !== achievement.id));
      }, 5000);
    };

    on("achievementUnlocked", handleAchievementUnlocked);

    return () => {
      off("achievementUnlocked", handleAchievementUnlocked);
    };
  }, [on, off]);

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {notifications.map((achievement, index) => (
        <div
          key={`${achievement.id}-${index}`}
          className="bg-green-600 text-white p-4 rounded-lg shadow-lg border-2 border-green-400 animate-in slide-in-from-right duration-300"
          style={{
            animation:
              "slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 4.7s forwards",
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{achievement.icon}</span>
            <div>
              <div className="font-bold text-lg">🏆 Достижение получено!</div>
              <div className="font-semibold">{achievement.name}</div>
              <div className="text-sm opacity-90">
                {achievement.description}
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
