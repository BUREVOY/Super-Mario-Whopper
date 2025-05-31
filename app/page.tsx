"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import AchievementNotification from "@/components/AchievementNotification";

// Динамический импорт игры для избежания SSR проблем
const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[600px] bg-yellow-400 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">
          🍔 Загрузка Super Mario Whopper...
        </h2>
        <p className="text-red-600">Готовим вкусное приключение!</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Устанавливаем что мы на клиенте
    setIsClient(true);

    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkMobile, 100);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  // Показываем загрузку пока не определили клиент
  if (!isClient) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-red-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            🍔 Super Mario Whopper
          </h2>
          <p className="text-white/90">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Мобильная версия - только игра по центру
  if (isMobile) {
    return (
      <>
        <AchievementNotification />
        <main className="w-full h-screen overflow-hidden bg-red-600 flex items-center justify-center">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-full bg-red-600">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    🍔 Super Mario Whopper
                  </h2>
                  <p className="text-white/90">Загрузка...</p>
                </div>
              </div>
            }
          >
            <Game className="w-full h-full" />
          </Suspense>
        </main>
      </>
    );
  }

  // Десктопная версия с полным интерфейсом
  return (
    <>
      <AchievementNotification />
      <main className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 p-4">
        <div className="container mx-auto max-w-6xl">
          {/* Заголовок */}
          <header className="text-center mb-8">
            <h1 className="text-6xl font-bold text-red-800 mb-4 drop-shadow-lg">
              🍔 Super Mario Whopper
            </h1>
            <p className="text-xl text-red-700 font-semibold">
              Приключения в королевстве Burger King!
            </p>
            <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
              <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                👑 Королевское качество
              </div>
              <div className="bg-yellow-500 text-red-800 px-4 py-2 rounded-full font-bold">
                🍟 Вкусное приключение
              </div>
              <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
                📱 Полная мобильная поддержка
              </div>
            </div>
          </header>

          {/* Игра - центрированная */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl shadow-2xl p-6 no-select max-w-5xl w-full">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[600px] bg-yellow-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-pulse text-6xl mb-4">🍔</div>
                      <p className="text-red-600 font-semibold">
                        Подготовка игры...
                      </p>
                    </div>
                  </div>
                }
              >
                <Game className="w-full" />
              </Suspense>
            </div>
          </div>

          {/* Информация об игре */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                🎮 Как играть
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">←→</span>
                  Движение влево и вправо
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">↑</span>
                  Прыжок (или пробел)
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">ESC</span>
                  Пауза
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">📱</span>
                  На мобильных: виртуальный джойстик
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">🍔</span>
                  Собирай бонусы и избегай врагов!
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                👑 Особенности
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">⭐</span>
                  Классический платформер в стиле Марио
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">🍟</span>
                  Враги в тематике фастфуда
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">📱</span>
                  Поддержка вертикального и горизонтального формата
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">👑</span>
                  Королевские бонусы и способности
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">🏆</span>
                  Система очков и достижений
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
