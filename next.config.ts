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

    return config;
  },

  // Headers для безопасности и Burger King брендинга
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-BK-Game",
            value: "Super Mario Whopper - Taste is King!",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
