import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Статический экспорт для GitHub Pages
  trailingSlash: true, // Добавляет / в конце URL
  images: {
    unoptimized: true, // Отключаем оптимизацию изображений
  },
  assetPrefix:
    process.env.NODE_ENV === "production" ? "/super_mario_whopper" : "",
  basePath: process.env.NODE_ENV === "production" ? "/super_mario_whopper" : "",

  webpack: (config, { isServer }) => {
    // Конфигурация для Phaser
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    // Обработка аудио файлов
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      use: {
        loader: "file-loader",
        options: {
          outputPath: "static/sounds/",
          publicPath: "/_next/static/sounds/",
        },
      },
    });

    return config;
  },
};

export default nextConfig;
