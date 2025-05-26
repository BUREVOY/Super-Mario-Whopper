"use client";

import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import { GAME_CONFIG } from "@/lib/constants";
import { PreloadScene } from "@/lib/game/scenes/PreloadScene";
import { MenuScene } from "@/lib/game/scenes/MenuScene";
import { GameScene } from "@/lib/game/scenes/GameScene";
import { GameOverScene } from "@/lib/game/scenes/GameOverScene";
import { VictoryScene } from "@/lib/game/scenes/VictoryScene";

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
        ],
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          min: {
            width: 320,
            height: 240,
          },
          max: {
            width: 1920,
            height: 1080,
          },
        },
        render: {
          antialias: true,
          pixelArt: false,
        },
        audio: {
          disableWebAudio: false,
        },
      };

      phaserGameRef.current = new Phaser.Game(config);

      // Обработчики событий игры
      phaserGameRef.current.events.on("ready", () => {
        setIsGameLoaded(true);
        console.log("🍔 Super Mario Whopper загружен!");
      });

      phaserGameRef.current.events.on("destroy", () => {
        setIsGameLoaded(false);
        console.log("🍔 Super Mario Whopper остановлен");
      });
    } catch (error) {
      console.error("Ошибка при инициализации игры:", error);
      setGameError(
        error instanceof Error ? error.message : "Неизвестная ошибка"
      );
    }

    // Cleanup функция
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        setIsGameLoaded(false);
      }
    };
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
        className="w-full h-full min-h-[600px] rounded-lg overflow-hidden shadow-lg"
        style={{
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          border: "4px solid #8B4513",
        }}
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
    </div>
  );
}
