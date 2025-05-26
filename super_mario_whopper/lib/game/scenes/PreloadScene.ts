import Phaser from "phaser";
import { SCENES, COLORS } from "../../constants";

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENES.PRELOAD });
  }

  preload(): void {
    this.createLoadingScreen();
    this.loadAssets();
    this.setupLoadingEvents();
  }

  private createLoadingScreen(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Фон в стиле Burger King
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      parseInt(COLORS.BK_RED.replace("#", ""), 16)
    );

    // Логотип игры
    const titleText = this.add.text(
      width / 2,
      height / 2 - 150,
      "SUPER MARIO WHOPPER",
      {
        fontSize: "48px",
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Black",
        stroke: COLORS.BLACK,
        strokeThickness: 4,
      }
    );
    titleText.setOrigin(0.5);

    // Подзаголовок
    const subtitleText = this.add.text(
      width / 2,
      height / 2 - 100,
      "Платформер в стиле Burger King",
      {
        fontSize: "24px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    subtitleText.setOrigin(0.5);

    // Прогресс бар фон
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(parseInt(COLORS.BLACK.replace("#", ""), 16));
    this.loadingBar.fillRect(width / 2 - 200, height / 2 + 50, 400, 30);

    // Прогресс бар
    this.progressBar = this.add.graphics();

    // Текст загрузки
    this.loadingText = this.add.text(
      width / 2,
      height / 2 + 100,
      "Загрузка...",
      {
        fontSize: "20px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
      }
    );
    this.loadingText.setOrigin(0.5);

    // Процент загрузки
    this.percentText = this.add.text(width / 2, height / 2 + 65, "0%", {
      fontSize: "18px",
      color: COLORS.BK_YELLOW,
      fontFamily: "Arial Bold",
    });
    this.percentText.setOrigin(0.5);
  }

  private loadAssets(): void {
    // Загрузка основных спрайтов из корневой папки sprites
    this.load.image("player", "assets/sprites/player.png");
    this.load.image("burger", "assets/sprites/burger.png");
    this.load.image("fries", "assets/sprites/fries.png");
    this.load.image("soda", "assets/sprites/soda.png");
    this.load.image("crown", "assets/sprites/crown.png");
    this.load.image("whopper", "assets/sprites/whopper.png");
    this.load.image("onion_rings", "assets/sprites/onion_rings.png");

    // Загрузка дополнительных спрайтов игрока (если есть)
    this.load.image("player_walk", "assets/sprites/player/mario_walk.png");
    this.load.image("player_jump", "assets/sprites/player/mario_jump.png");
    this.load.image("player_damage", "assets/sprites/player/mario_damage.png");

    // Загрузка платформ и фонов
    this.load.image("ground", "assets/sprites/ground.png");
    this.load.image("platform", "assets/sprites/platform.png");
    this.load.image("bk_background", "assets/backgrounds/bk_restaurant.png");
    this.load.image("bk_restaurant", "assets/backgrounds/bk_restaurant.png");

    // Загрузка звуков
    this.load.audio("jump_sound", "assets/sounds/jump.wav");
    this.load.audio("collect_sound", "assets/sounds/collect.wav");
    this.load.audio("damage_sound", "assets/sounds/damage.wav");
    this.load.audio("victory_sound", "assets/sounds/victory.wav");
    this.load.audio("enemy_defeat", "assets/sounds/enemy_defeat.wav");
    this.load.audio("bg_music", "assets/sounds/background_music.mp3");

    // Загрузка UI элементов
    this.load.image("button", "assets/ui/button.png");
    this.load.image("button_hover", "assets/ui/button_hover.png");
    this.load.image("bk_logo", "assets/ui/bk_logo.png");

    // Создание простых цветных текстур для тестирования
    this.createColorTextures();

    // Обработка загруженных изображений для масштабирования
    this.load.on("filecomplete", (key: string) => {
      this.processLoadedTexture(key);
    });
  }

  private createColorTextures(): void {
    // Создание простых цветных прямоугольников для тестирования
    const graphics = this.add.graphics();

    // Игрок (красный квадрат) - увеличено в 2 раза
    graphics.fillStyle(parseInt(COLORS.BK_RED.replace("#", ""), 16));
    graphics.fillRect(0, 0, 64, 96); // Увеличено с 32x48 до 64x96
    graphics.generateTexture("player_placeholder", 64, 96);

    // Враги - увеличенные размеры в 2 раза
    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_BROWN.replace("#", ""), 16));
    graphics.fillRect(0, 0, 80, 80); // Увеличено с 40x40 до 80x80
    graphics.generateTexture("burger_placeholder", 80, 80);

    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_YELLOW.replace("#", ""), 16));
    graphics.fillRect(0, 0, 64, 96); // Увеличено с 32x48 до 64x96
    graphics.generateTexture("fries_placeholder", 64, 96);

    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_ORANGE.replace("#", ""), 16));
    graphics.fillRect(0, 0, 72, 104); // Увеличено с 36x52 до 72x104
    graphics.generateTexture("soda_placeholder", 72, 104);

    // Бонусы - увеличенные размеры в 2 раза
    graphics.clear();
    graphics.fillStyle(0xffd700); // Золотой
    graphics.fillRect(0, 0, 64, 64); // Увеличено с 32x32 до 64x64
    graphics.generateTexture("crown_placeholder", 64, 64);

    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_ORANGE.replace("#", ""), 16));
    graphics.fillRect(0, 0, 80, 80); // Увеличено с 40x40 до 80x80
    graphics.generateTexture("whopper_placeholder", 80, 80);

    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_YELLOW.replace("#", ""), 16));
    graphics.fillRect(0, 0, 72, 72); // Увеличено с 36x36 до 72x72
    graphics.generateTexture("onion_rings_placeholder", 72, 72);

    // Платформы
    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_BROWN.replace("#", ""), 16));
    graphics.fillRect(0, 0, 64, 32);
    graphics.generateTexture("ground_placeholder", 64, 32);

    graphics.clear();
    graphics.fillStyle(parseInt(COLORS.BK_BROWN.replace("#", ""), 16));
    graphics.fillRect(0, 0, 64, 32);
    graphics.generateTexture("platform_placeholder", 64, 32);

    // Фон
    graphics.clear();
    graphics.fillGradientStyle(
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      parseInt(COLORS.BK_ORANGE.replace("#", ""), 16),
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16),
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      1
    );
    graphics.fillRect(0, 0, 1024, 768);
    graphics.generateTexture("bk_background_placeholder", 1024, 768);

    // Фон ресторана (копия)
    graphics.clear();
    graphics.fillGradientStyle(
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      parseInt(COLORS.BK_ORANGE.replace("#", ""), 16),
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16),
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      1
    );
    graphics.fillRect(0, 0, 1024, 768);
    graphics.generateTexture("bk_restaurant_placeholder", 1024, 768);

    graphics.destroy();
  }

  private setupLoadingEvents(): void {
    this.load.on("progress", (value: number) => {
      this.updateProgressBar(value);
    });

    this.load.on("fileprogress", (file: any) => {
      this.updateLoadingText(file.key);
    });

    this.load.on("complete", () => {
      this.loadingComplete();
    });

    // Обработка ошибок загрузки
    this.load.on("loaderror", (file: any) => {
      console.warn(`Не удалось загрузить файл: ${file.key} - ${file.src}`);
      // Создаем fallback текстуру
      this.createFallbackTexture(file.key);
    });
  }

  private updateProgressBar(value: number): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.progressBar.clear();
    this.progressBar.fillStyle(parseInt(COLORS.BK_YELLOW.replace("#", ""), 16));
    this.progressBar.fillRect(
      width / 2 - 198,
      height / 2 + 52,
      396 * value,
      26
    );

    this.percentText.setText(`${Math.round(value * 100)}%`);
  }

  private updateLoadingText(key: string): void {
    const loadingMessages: { [key: string]: string } = {
      player: "Загрузка персонажа...",
      burger: "Загрузка бургеров...",
      fries: "Загрузка картошки фри...",
      soda: "Загрузка газировки...",
      crown: "Загрузка корон...",
      whopper: "Загрузка вопперов...",
      onion_rings: "Загрузка луковых колец...",
      ground: "Загрузка платформ...",
      bk_background: "Загрузка фона...",
      jump_sound: "Загрузка звуков прыжка...",
      collect_sound: "Загрузка звуков сбора...",
      bg_music: "Загрузка музыки...",
    };

    const message = loadingMessages[key] || "Загрузка ресурсов...";
    this.loadingText.setText(message);
  }

  private loadingComplete(): void {
    this.progressBar.clear();
    this.loadingBar.clear();

    // Создаем fallback текстуры для тех, что не загрузились
    this.createFallbackTextures();

    // Логируем загруженные текстуры для отладки
    console.log("🍔 Загруженные текстуры:");
    const textureKeys = [
      "player",
      "player_walk",
      "player_jump",
      "player_damage",
      "burger",
      "fries",
      "soda",
      "crown",
      "whopper",
      "onion_rings",
      "ground",
      "platform",
      "bk_background",
    ];

    textureKeys.forEach((key) => {
      if (this.textures.exists(key)) {
        console.log(`✅ ${key} - загружен`);
      } else {
        console.log(`❌ ${key} - НЕ загружен`);
      }
    });

    this.loadingText.setText("Загрузка завершена!");
    this.percentText.setText("100%");

    // Переход к главному меню через 1 секунду
    this.time.delayedCall(1000, () => {
      this.scene.start(SCENES.MENU);
    });
  }

  private createFallbackTextures(): void {
    // Проверяем, загрузились ли основные текстуры, если нет - используем placeholder'ы
    const textures = [
      { key: "player", fallback: "player_placeholder" },
      { key: "burger", fallback: "burger_placeholder" },
      { key: "fries", fallback: "fries_placeholder" },
      { key: "soda", fallback: "soda_placeholder" },
      { key: "crown", fallback: "crown_placeholder" },
      { key: "whopper", fallback: "whopper_placeholder" },
      { key: "onion_rings", fallback: "onion_rings_placeholder" },
      { key: "ground", fallback: "ground_placeholder" },
      { key: "platform", fallback: "platform_placeholder" },
      { key: "bk_background", fallback: "bk_background_placeholder" },
      { key: "bk_restaurant", fallback: "bk_restaurant_placeholder" },
    ];

    textures.forEach(({ key, fallback }) => {
      if (!this.textures.exists(key)) {
        // Копируем fallback текстуру под основным именем
        const fallbackTexture = this.textures.get(fallback);
        if (fallbackTexture && fallbackTexture.source[0]) {
          // Создаем новую текстуру с тем же содержимым
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const source = fallbackTexture.source[0];

          canvas.width = source.width;
          canvas.height = source.height;

          if (ctx && source.image) {
            ctx.drawImage(source.image as any, 0, 0);
            this.textures.addCanvas(key, canvas);
          }
        }
      }
    });
  }

  private createFallbackTexture(key: string): void {
    const graphics = this.add.graphics();

    // Определяем цвет и размер в зависимости от типа
    let color = parseInt(COLORS.BK_RED.replace("#", ""), 16);
    let width = 32;
    let height = 32;

    if (key.includes("player")) {
      color = parseInt(COLORS.BK_RED.replace("#", ""), 16);
      width = 64; // Увеличено с 32 до 64
      height = 96; // Увеличено с 48 до 96
    } else if (key.includes("burger")) {
      color = parseInt(COLORS.BK_BROWN.replace("#", ""), 16);
      width = 80; // Увеличено с 40 до 80
      height = 80; // Увеличено с 40 до 80
    } else if (key.includes("fries")) {
      color = parseInt(COLORS.BK_YELLOW.replace("#", ""), 16);
      width = 64; // Увеличено с 32 до 64
      height = 96; // Увеличено с 48 до 96
    } else if (key.includes("soda")) {
      color = parseInt(COLORS.BK_ORANGE.replace("#", ""), 16);
      width = 72; // Увеличено с 36 до 72
      height = 104; // Увеличено с 52 до 104
    } else if (key.includes("crown")) {
      color = 0xffd700; // Золотой
      width = 64; // Увеличено с 32 до 64
      height = 64; // Увеличено с 32 до 64
    } else if (key.includes("whopper")) {
      color = parseInt(COLORS.BK_RED.replace("#", ""), 16);
      width = 80; // Увеличено с 40 до 80
      height = 80; // Увеличено с 40 до 80
    } else if (key.includes("onion_rings")) {
      color = parseInt(COLORS.BK_YELLOW.replace("#", ""), 16);
      width = 72; // Увеличено с 36 до 72
      height = 72; // Увеличено с 36 до 72
    }

    graphics.fillStyle(color);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  private processLoadedTexture(key: string): void {
    if (!this.textures.exists(key)) return;

    // Пропускаем фоновые изображения - они не должны масштабироваться
    if (key.includes("background") || key.includes("restaurant")) {
      return;
    }

    const texture = this.textures.get(key);
    const source = texture.source[0];

    if (!source) return;

    // Определяем целевые размеры для разных типов спрайтов
    let targetWidth = 32;
    let targetHeight = 32;

    if (key.includes("player")) {
      targetWidth = 64; // Увеличено с 32 до 64
      targetHeight = 96; // Увеличено с 48 до 96
    } else if (key.includes("burger")) {
      targetWidth = 80; // Увеличено с 40 до 80
      targetHeight = 80; // Увеличено с 40 до 80
    } else if (key.includes("fries")) {
      targetWidth = 64; // Увеличено с 32 до 64
      targetHeight = 96; // Увеличено с 48 до 96
    } else if (key.includes("soda")) {
      targetWidth = 72; // Увеличено с 36 до 72
      targetHeight = 104; // Увеличено с 52 до 104
    } else if (key.includes("crown")) {
      targetWidth = 64; // Увеличено с 32 до 64
      targetHeight = 64; // Увеличено с 32 до 64
    } else if (key.includes("whopper")) {
      targetWidth = 80; // Увеличено с 40 до 80
      targetHeight = 80; // Увеличено с 40 до 80
    } else if (key.includes("onion_rings")) {
      targetWidth = 72; // Увеличено с 36 до 72
      targetHeight = 72; // Увеличено с 36 до 72
    } else if (key.includes("ground")) {
      targetWidth = 64;
      targetHeight = 32;
    } else if (key.includes("platform")) {
      targetWidth = 64;
      targetHeight = 32;
    }

    // Если изображение слишком большое, создаем масштабированную версию
    if (source.width > targetWidth * 2 || source.height > targetHeight * 2) {
      this.createScaledTexture(key, targetWidth, targetHeight);
    }
  }

  private createScaledTexture(
    originalKey: string,
    targetWidth: number,
    targetHeight: number
  ): void {
    const originalTexture = this.textures.get(originalKey);
    const source = originalTexture.source[0];

    if (!source || !source.image) return;

    // Создаем canvas для масштабирования
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Включаем сглаживание для лучшего качества (кроме пиксельных спрайтов)
    const isPixelSprite =
      originalKey.includes("player") ||
      originalKey.includes("burger") ||
      originalKey.includes("fries") ||
      originalKey.includes("soda") ||
      originalKey.includes("crown") ||
      originalKey.includes("whopper") ||
      originalKey.includes("onion_rings");

    ctx.imageSmoothingEnabled = !isPixelSprite; // Сглаживание для фонов, пиксели для спрайтов

    // Рисуем масштабированное изображение
    ctx.drawImage(
      source.image as HTMLImageElement,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Заменяем оригинальную текстуру масштабированной
    this.textures.addCanvas(`${originalKey}_scaled`, canvas);

    // Удаляем оригинальную и переименовываем масштабированную
    this.textures.remove(originalKey);
    this.textures.addCanvas(originalKey, canvas);

    console.log(
      `🔧 Масштабировал ${originalKey} до ${targetWidth}x${targetHeight}`
    );
  }

  create(): void {
    // Эта функция вызывается после preload
    // Здесь можно добавить дополнительную логику инициализации
  }
}
