"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";
import { GAME_CONFIG } from "../lib/constants";
import { PreloadScene } from "../lib/game/scenes/PreloadScene";
import { MenuScene } from "../lib/game/scenes/MenuScene";
import { GameScene } from "../lib/game/scenes/GameScene";

export default function GameComponent() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      containerRef.current &&
      !gameRef.current
    ) {
      // Конфигурация игры Phaser
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: GAME_CONFIG.WIDTH,
        height: GAME_CONFIG.HEIGHT,
        parent: containerRef.current,
        backgroundColor: GAME_CONFIG.BACKGROUND_COLOR,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: GAME_CONFIG.GRAVITY },
            debug: false, // Установить в true для отладки
          },
        },
        scene: [PreloadScene, MenuScene, GameScene],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          min: {
            width: 800,
            height: 600,
          },
          max: {
            width: 1600,
            height: 1200,
          },
        },
        audio: {
          disableWebAudio: false,
        },
        input: {
          keyboard: true,
          mouse: true,
          touch: true,
        },
        render: {
          antialias: true,
          pixelArt: false,
          roundPixels: false,
        },
      };

      // Создание игры
      gameRef.current = new Phaser.Game(config);

      // Обработка ошибок
      gameRef.current.events.on("error", (error: Error) => {
        console.error("Phaser Game Error:", error);
      });
    }

    // Cleanup функция
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.refresh();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="game-container">
      <div
        ref={containerRef}
        className="game-canvas"
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #D32F2F 0%, #FF9800 50%, #FFC107 100%)",
        }}
      />

      {/* Стили для игры */}
      <style jsx>{`
        .game-container {
          width: 100%;
          height: 100vh;
          overflow: hidden;
          position: relative;
        }

        .game-canvas {
          position: relative;
        }

        .game-canvas canvas {
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        /* Адаптивность для мобильных устройств */
        @media (max-width: 768px) {
          .game-canvas canvas {
            border-radius: 0;
          }
        }

        /* Полноэкранный режим */
        .game-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
