import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker и production настройки
  output: "standalone",

  // Оптимизация для статических ассетов
  images: {
    unoptimized: true,
  },

  // Настройки для игровых ассетов
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",

  // Webpack конфигурация для игровых ресурсов
  webpack: (config, { isServer }) => {
    // Поддержка аудио файлов
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/sounds/",
          outputPath: "static/sounds/",
        },
      },
    });

    // Поддержка изображений игры
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/images/",
          outputPath: "static/images/",
        },
      },
    });

    return config;
  },

  // Настройки для TypeScript
  typescript: {
    // Игнорировать ошибки типов в production сборке для Docker
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },

  // ESLint настройки
  eslint: {
    // Игнорировать ESLint ошибки в production сборке для Docker
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },

  // Headers для безопасности и Burger King брендинга
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Powered-By",
            value: "Burger King - Taste is King!",
          },
          {
            key: "X-Game-Version",
            value: "1.0.0",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // Кэширование статических игровых ассетов
        source: "/assets/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Кэширование спрайтов
        source: "/sprites/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Настройки для разработки
  ...(process.env.NODE_ENV === "development" && {
    // Hot reload для игровых файлов
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),

  // API routes настройки
  async rewrites() {
    return [
      {
        source: "/api/health",
        destination: "/api/health",
      },
    ];
  },
};

export default nextConfig;
