"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { GAME_CONFIG } from "@/lib/constants";
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

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    try {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: GAME_CONFIG.WIDTH,
        height: GAME_CONFIG.HEIGHT,
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
          parent: gameRef.current,
          width: window.innerWidth,
          height: window.innerHeight,
          expandParent: true,
          fullscreenTarget: gameRef.current,
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

      // Обработка изменения размера экрана для мобильных устройств
      const handleResize = () => {
        if (phaserGameRef.current) {
          const game = phaserGameRef.current;

          // Обновляем размеры игры под размер экрана
          game.scale.resize(window.innerWidth, window.innerHeight);

          const mobileControlsScene = game.scene.getScene(
            "MobileControlsScene"
          ) as unknown;

          if (
            mobileControlsScene &&
            typeof mobileControlsScene === "object" &&
            mobileControlsScene !== null &&
            "resize" in mobileControlsScene
          ) {
            // Проверяем, что сцена активна и готова
            const scene = mobileControlsScene as unknown as Phaser.Scene;
            if (scene.scene && scene.scene.isActive()) {
              // Ждем события готовности сцены если она не готова
              const sceneWithEvents = scene as unknown as {
                events: { once: (event: string, callback: () => void) => void };
              };

              // Проверяем флаг инициализации
              const sceneWithInit = mobileControlsScene as {
                isInitialized?: boolean;
              };
              if (sceneWithInit.isInitialized) {
                // Сцена готова, можно вызывать resize
                (
                  mobileControlsScene as {
                    resize: (width: number, height: number) => void;
                  }
                ).resize(window.innerWidth, window.innerHeight);
              } else {
                // Ждем готовности сцены
                console.log("🎮 Ждем готовности MobileControlsScene");
                sceneWithEvents.events.once("mobileControlsReady", () => {
                  (
                    mobileControlsScene as {
                      resize: (width: number, height: number) => void;
                    }
                  ).resize(window.innerWidth, window.innerHeight);
                });
              }
            } else {
              console.log("🎮 MobileControlsScene не активна");
            }
          }
        }
      };

      // Обработка изменения ориентации
      const handleOrientationChange = () => {
        setTimeout(() => {
          handleResize();

          // Попытка войти в полноэкранный режим на мобильных устройствах
          const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
              navigator.userAgent
            );
          if (
            isMobile &&
            phaserGameRef.current &&
            !document.fullscreenElement
          ) {
            const gameCanvas = gameRef.current;
            if (gameCanvas && gameCanvas.requestFullscreen) {
              gameCanvas.requestFullscreen().catch((error) => {
                console.log("Не удалось войти в полноэкранный режим:", error);
              });
            }
          }
        }, 100); // Небольшая задержка для корректного получения размеров
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

        // Автоматически включаем полноэкранный режим на мобильных устройствах
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );
        if (isMobile && gameRef.current && !document.fullscreenElement) {
          // Небольшая задержка чтобы убедиться что всё загружено
          setTimeout(() => {
            const gameCanvas = gameRef.current;
            if (gameCanvas && gameCanvas.requestFullscreen) {
              gameCanvas.requestFullscreen().catch((error) => {
                console.log(
                  "Не удалось автоматически войти в полноэкранный режим:",
                  error
                );
              });
            }
          }, 1000);
        }
      });

      phaserGameRef.current.events.on("destroy", () => {
        setIsGameLoaded(false);
        console.log("🍔 Super Mario Whopper остановлен");
      });

      // Дополнительная проверка - если игра создана, считаем её загруженной
      setTimeout(() => {
        if (phaserGameRef.current && !isGameLoaded) {
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
  }, [isGameLoaded]);

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
        className="w-full h-full min-h-[600px] rounded-lg overflow-hidden shadow-lg relative"
        style={
          {
            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
            border: "4px solid #8B4513",
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1,
            touchAction: "none",
            userSelect: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none",
            MozUserSelect: "none",
            WebkitTouchCallout: "none",
            WebkitTapHighlightColor: "transparent",
          } as React.CSSProperties
        }
      />

      {/* Информация об управлении */}
      {isGameLoaded && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-sm">
          <div className="font-bold mb-1">🎮 Управление:</div>
          <div>← → Движение</div>
          <div>↑ / Пробел - Прыжок</div>
          <div>ESC - Пауза</div>
        </div>
      )}

      {/* Кнопки управления в правом верхнем углу */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* Кнопка полноэкранного режима */}
        <button
          onClick={() => {
            const gameCanvas = gameRef.current;
            if (!document.fullscreenElement && gameCanvas) {
              gameCanvas.requestFullscreen().catch((error) => {
                console.log("Не удалось войти в полноэкранный режим:", error);
              });
            } else if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1"
        >
          {document.fullscreenElement ? "🔲 Выйти" : "📺 Полный экран"}
        </button>

        {/* Кнопка отладки для принудительного показа игры */}
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
                phaserGameRef.current.scene.getScenes().map((s) => s.scene.key)
              );
            }
          }}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          🔧 Показать игру
        </button>
      </div>
    </div>
  );
}
