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

// Компонент для сообщения об ориентации
function OrientationMessage() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || "ontouchstart" in window;

      const isPortrait = window.innerHeight > window.innerWidth;
      const isFullscreen = !!document.fullscreenElement;

      // Показываем сообщение только если это мобильное устройство, портретная ориентация и НЕ полноэкранный режим
      setShowMessage(isMobile && isPortrait && !isFullscreen);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkOrientation, 100);
    });

    // Слушаем события полноэкранного режима
    document.addEventListener("fullscreenchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
      document.removeEventListener("fullscreenchange", checkOrientation);
    };
  }, []);

  if (!showMessage) return null;

  return (
    <div className="orientation-message">
      <h2>🍔 Super Mario Whopper</h2>
      <p>Для лучшего игрового опыта поверните устройство в ландшафтный режим</p>
      <div className="rotate-icon">📱</div>
      <p style={{ fontSize: "14px", marginTop: "20px", opacity: 0.8 }}>
        Поверните телефон горизонтально или нажмите на игру для полноэкранного
        режима
      </p>
    </div>
  );
}

export default function HomePage() {
  // Добавляем стили для предотвращения скролла на мобильных устройствах
  useEffect(() => {
    // Добавляем стили к документу
    const style = document.createElement("style");
    style.textContent = `
      body {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
        touch-action: none !important;
        -webkit-overflow-scrolling: touch !important;
        -webkit-user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        user-select: none !important;
      }
      
      html {
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
        touch-action: none !important;
      }
      
      .game-container {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        touch-action: none !important;
        z-index: 9999 !important;
      }
      
      /* Стили для сообщения об ориентации */
      .orientation-message {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background-color: #D32F2F !important;
        color: white !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        text-align: center !important;
        z-index: 10000 !important;
        font-family: Arial, sans-serif !important;
        padding: 20px !important;
        box-sizing: border-box !important;
      }
      
      .orientation-message h2 {
        font-size: 2rem !important;
        margin-bottom: 1rem !important;
        font-weight: bold !important;
      }
      
      .orientation-message p {
        font-size: 1.2rem !important;
        margin-bottom: 1rem !important;
        line-height: 1.5 !important;
      }
      
      .rotate-icon {
        font-size: 4rem !important;
        margin: 2rem 0 !important;
        animation: rotate 2s infinite linear !important;
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(90deg); }
      }
      
      /* Скрываем переполнение и скроллбары */
      ::-webkit-scrollbar {
        display: none !important;
      }
      
      /* Предотвращаем зум на мобильных устройствах */
      * {
        -webkit-user-drag: none !important;
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        user-select: none !important;
      }
    `;
    document.head.appendChild(style);

    // Очистка при размонтировании компонента
    return () => {
      document.head.removeChild(style);
      // Восстанавливаем нормальные стили
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
    };
  }, []);

  return (
    <>
      <OrientationMessage />
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
          <div className="bg-white rounded-xl shadow-2xl p-6 mb-8 no-select">
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

          {/* Статистика игры */}
          {/* <GameStats className="mb-8" /> */}

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

          {/* Футер */}
          <footer className="text-center text-red-700">
            <p className="text-lg font-semibold mb-2">
              Создано с ❤️ для любителей платформеров и вкусной еды
            </p>
            <p className="text-sm opacity-75">
              Super Mario Whopper © 2024 | Powered by Phaser 3 & Next.js
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
