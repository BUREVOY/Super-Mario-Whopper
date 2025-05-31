"use client";

import { useState, useEffect } from "react";
import Game from "@/components/Game";
import AchievementNotification from "@/components/AchievementNotification";

// Функция для определения мобильного устройства
function isMobileDevice() {
  if (typeof window === "undefined") return false;

  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || "ontouchstart" in window
  );
}

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobile(isMobileDevice());
  }, []);

  // Не рендерим ничего до загрузки клиента для избежания гидрации
  if (!isClient) {
    return (
      <div className="w-full h-screen bg-red-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">🍔 Super Mario Whopper</h2>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Для мобильных устройств показываем только игру без дополнительных элементов
  if (isMobile) {
    return (
      <div className="w-full h-screen overflow-hidden bg-red-600 flex items-center justify-center">
        <Game className="w-full h-full" />
      </div>
    );
  }

  // Для десктопа показываем полный интерфейс
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-300 to-red-400 p-4 game-container">
      {/* Уведомления о достижениях */}
      <AchievementNotification />

      <div className="container mx-auto max-w-6xl">
        {/* Заголовок */}
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold text-red-800 mb-4 drop-shadow-lg">
            🍔 Super Mario Whopper
          </h1>
          <p className="text-xl text-red-700 font-semibold">
            Приключения в королевстве Burger King!
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">
              👑 Королевское качество
            </div>
            <div className="bg-yellow-500 text-red-800 px-4 py-2 rounded-full font-bold">
              🍟 Вкусное приключение
            </div>
            <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
              📱 Мобильная поддержка
            </div>
          </div>
        </header>

        {/* Игра */}
        <section className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <Game className="w-full rounded-xl overflow-hidden shadow-lg" />
          </div>
        </section>

        {/* Функции игры */}
        <section className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-red-600 text-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              🎮 Особенности игры
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">👑</span> Собирайте короны для
                неуязвимости
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">🍔</span> Ловите Whopper для
                здоровья
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">🧅</span> Луковые кольца дают
                скорость
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-300">🏆</span> Побеждайте
                врагов-фастфуд
              </li>
            </ul>
          </div>

          <div className="bg-yellow-500 text-red-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              ⌨️ Управление
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Стрелки ← →</strong> - движение
              </p>
              <p>
                <strong>Стрелка ↑ / Пробел</strong> - прыжок
              </p>
              <p>
                <strong>P</strong> - пауза
              </p>
              <p>
                <strong>R</strong> - перезапуск
              </p>
              <p className="text-sm opacity-75 mt-4">
                📱 На мобильных устройствах: виртуальные кнопки
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-2xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              🍔 Захотелось настоящий Whopper?
            </h2>
            <p className="text-lg mb-6">
              После игры можно заказать настоящую еду в Burger King!
            </p>
            <a
              href="https://burgerkingrus.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              🍟 Заказать еду
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
