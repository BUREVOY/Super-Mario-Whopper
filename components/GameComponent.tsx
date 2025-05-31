"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import GameStats from "./GameStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Динамическая загрузка игры для предотвращения SSR проблем
const Game = dynamic(() => import("./Game"), { ssr: false });

export default function GameComponent() {
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

    const handleOrientationChange = () => {
      setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  // Показываем загрузку пока не определили клиент
  if (!isClient) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-600">
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

  // Мобильная версия - только игра
  if (isMobile) {
    return (
      <div className="w-full h-screen overflow-hidden bg-red-600 flex items-center justify-center">
        <div className="game-container w-full h-full">
          <Game className="w-full h-full" />
        </div>
      </div>
    );
  }

  // Десктопная версия с полным UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-orange-600 flex flex-col">
      {/* Информационная панель - только на десктопе */}
      <div className="bg-white/10 backdrop-blur-sm p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">
            🍔 Super Mario Whopper
          </h1>
          <p className="text-white/90">
            Платформер в стиле Burger King! Поддерживает как горизонтальный, так
            и вертикальный режим на мобильных устройствах.
          </p>
        </div>
      </div>

      {/* Игровой контейнер */}
      <div className="flex-1 relative">
        <div className="game-container w-full h-full">
          <Game className="w-full h-full" />
        </div>
      </div>

      {/* Статистика игры - только на десктопе в боковой панели */}
      <div className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 w-80">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Статистика игры</CardTitle>
          </CardHeader>
          <CardContent>
            <GameStats />
          </CardContent>
        </Card>
      </div>

      {/* Инструкции управления - только на десктопе */}
      <div className="bg-black/20 backdrop-blur-sm p-3">
        <div className="container mx-auto text-center">
          <p className="text-white/90 text-sm">
            <span className="font-semibold">Управление:</span> ← → движение • ↑
            или Пробел прыжок • P пауза • R перезапуск
          </p>
        </div>
      </div>
    </div>
  );
}
