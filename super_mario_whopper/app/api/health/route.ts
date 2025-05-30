import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Базовые проверки здоровья приложения
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Super Mario Whopper",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
      },
      burger_king: {
        brand: "Burger King",
        slogan: "Taste is King!",
        game_ready: true,
      },
    };

    // Дополнительные проверки для production
    if (process.env.NODE_ENV === "production") {
      // Проверка доступности игровых ассетов
      // В реальном приложении здесь могут быть проверки БД, Redis и т.д.
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Health-Check": "Super Mario Whopper",
        "X-Powered-By": "Burger King - Taste is King!",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        service: "Super Mario Whopper",
        error: "Health check failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Health-Check": "Super Mario Whopper - ERROR",
        },
      }
    );
  }
}
