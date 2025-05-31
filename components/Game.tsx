"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { GAME_CONFIG, VIEWPORT_UTILS } from "@/lib/constants";
import { PreloadScene } from "@/lib/game/scenes/PreloadScene";
import { MenuScene } from "@/lib/game/scenes/MenuScene";
import { GameScene } from "@/lib/game/scenes/GameScene";
import { GameOverScene } from "@/lib/game/scenes/GameOverScene";
import { VictoryScene } from "@/lib/game/scenes/VictoryScene";
import { MobileControlsScene } from "@/lib/game/scenes/MobileControlsScene";

interface GameProps {
  className?: string;
}

export default function Game({ className = "" }: GameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);

  // Функция для получения оптимальных размеров игры
  const getOptimalGameSize = () => {
    const { width, height } = VIEWPORT_UTILS.getGameDimensions();
    return { width, height };
  };

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    try {
      const { width, height } = getOptimalGameSize();

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width,
        height,
        parent: gameRef.current,
        backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: GAME_CONFIG.GRAVITY, x: 0 },
            debug: false,
          },
        },
        scene: [
          PreloadScene,
          MenuScene,
          GameScene,
          GameOverScene,
          VictoryScene,
          MobileControlsScene,
        ],
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          min: {
            width: 320,
            height: 240,
          },
          max: {
            width: 1920,
            height: 1920, // Увеличиваем максимальную высоту для вертикального формата
          },
          // Автоматическое масштабирование под контейнер
          expandParent: true,
          autoRound: true,
        },
        input: {
          touch: {
            capture: true,
          },
          mouse: {
            preventDefaultWheel: false,
          },
          activePointers: 3, // Поддержка мультитач
        },
        render: {
          antialias: true,
          pixelArt: false,
          roundPixels: false,
        },
        // Мобильная оптимизация
        autoMobilePipeline: true,
        powerPreference: "high-performance",
        audio: {
          disableWebAudio: false,
        },
        dom: {
          createContainer: true,
        },
      };

      phaserGameRef.current = new Phaser.Game(config);

      // Обработка изменения размера экрана и ориентации
      const handleResize = () => {
        if (phaserGameRef.current) {
          const game = phaserGameRef.current;

          // Обновляем размеры игры
          const container = gameRef.current;
          if (container) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            game.scale.resize(containerWidth, containerHeight);
          }

          // Обновляем мобильные элементы управления
          const mobileControlsScene = game.scene.getScene(
            "MobileControlsScene"
          ) as unknown;
          if (
            mobileControlsScene &&
            typeof mobileControlsScene === "object" &&
            mobileControlsScene !== null &&
            "resize" in mobileControlsScene
          ) {
            (
              mobileControlsScene as {
                resize: (width: number, height: number) => void;
              }
            ).resize(window.innerWidth, window.innerHeight);
          }
        }
      };

      // Обработка изменения ориентации
      const handleOrientationChange = () => {
        setTimeout(handleResize, 100); // Небольшая задержка для корректного получения размеров
      };

      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleOrientationChange);

      // Предотвращение зума на мобильных устройствах
      const preventZoom = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      document.addEventListener("touchstart", preventZoom, { passive: false });

      setIsGameLoaded(true);

      // Обработчики событий игры
      phaserGameRef.current.events.on("ready", () => {
        console.log("🍔 Super Mario Whopper загружен!");
        setIsGameLoaded(true);
        handleResize(); // Применяем правильные размеры после загрузки
      });

      phaserGameRef.current.events.on("destroy", () => {
        setIsGameLoaded(false);
        console.log("🍔 Super Mario Whopper остановлен");
      });

      // Дополнительная проверка - если игра создана, считаем её загруженной
      setTimeout(() => {
        if (phaserGameRef.current) {
          console.log("🎮 Принудительно устанавливаем флаг загрузки игры");
          setIsGameLoaded(true);
        }

        // Проверяем canvas
        if (gameRef.current) {
          const canvas = gameRef.current.querySelector("canvas");
          if (canvas) {
            console.log("🎮 Canvas найден:", canvas);
            console.log("🎮 Canvas размеры:", canvas.width, "x", canvas.height);
            console.log("🎮 Canvas стили:", window.getComputedStyle(canvas));

            // Принудительно делаем canvas видимым
            canvas.style.display = "block";
            canvas.style.visibility = "visible";
            canvas.style.opacity = "1";
            canvas.style.zIndex = "1";

            console.log("🎮 Canvas принудительно сделан видимым");
          } else {
            console.log("❌ Canvas не найден в контейнере");
          }
        }

        // Применяем размеры после загрузки
        handleResize();
      }, 2000); // Через 2 секунды после создания

      // Cleanup функция
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
        document.removeEventListener("touchstart", preventZoom);

        if (phaserGameRef.current) {
          phaserGameRef.current.destroy(true);
          phaserGameRef.current = null;
        }
      };
    } catch (error) {
      console.error("Ошибка при создании игры:", error);
      setGameError(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }
  }, []);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.scale.refresh();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (gameError) {
    return (
      <div
        className={`flex items-center justify-center min-h-[600px] bg-red-100 border border-red-400 rounded-lg ${className}`}
      >
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">
            🍔 Ошибка загрузки игры
          </h2>
          <p className="text-red-600 mb-4">{gameError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Перезагрузить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Индикатор загрузки */}
      {!isGameLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-400 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              🍔 Загрузка Super Mario Whopper...
            </h2>
            <p className="text-red-600">Готовим вкусное приключение!</p>
          </div>
        </div>
      )}

      {/* Контейнер для игры */}
      <div
        ref={gameRef}
        className="w-full h-full min-h-[600px] overflow-hidden relative"
        style={{
          background: VIEWPORT_UTILS.isMobile()
            ? "#D32F2F"
            : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          border: VIEWPORT_UTILS.isMobile() ? "none" : "4px solid #8B4513",
          borderRadius: VIEWPORT_UTILS.isMobile() ? "0" : "8px",
          boxShadow: VIEWPORT_UTILS.isMobile()
            ? "none"
            : "0 4px 6px rgba(0, 0, 0, 0.1)",
          display: "block",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Информация об управлении - только на десктопе */}
      {!VIEWPORT_UTILS.isMobile() && isGameLoaded && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
          <div className="font-bold mb-1">🎮 Управление:</div>
          <div>← → Движение</div>
          <div>↑ / Пробел - Прыжок</div>
          <div>ESC - Пауза</div>
        </div>
      )}

      {/* Кнопка отладки - только для разработки и только на десктопе */}
      {process.env.NODE_ENV === "development" && !VIEWPORT_UTILS.isMobile() && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => {
              console.log("🔧 Принудительный показ игры");
              setIsGameLoaded(true);

              if (gameRef.current) {
                const canvas = gameRef.current.querySelector("canvas");
                if (canvas) {
                  canvas.style.display = "block";
                  canvas.style.visibility = "visible";
                  canvas.style.opacity = "1";
                  canvas.style.zIndex = "10";
                  console.log("🔧 Canvas принудительно показан");
                }
              }

              if (phaserGameRef.current) {
                console.log(
                  "🔧 Текущая сцена:",
                  phaserGameRef.current.scene
                    .getScenes()
                    .map((s) => s.scene.key)
                );
              }
            }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            🔧 Показать игру
          </button>
        </div>
      )}
    </div>
  );
}
