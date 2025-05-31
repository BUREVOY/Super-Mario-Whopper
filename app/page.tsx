"use client";

import dynamic from "next/dynamic";

// Динамический импорт всего содержимого страницы для избежания SSR проблем
const HomePage = dynamic(() => import("@/components/HomePage"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-red-600 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">🍔 Super Mario Whopper</h2>
        <p>Загрузка...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <HomePage />;
}
