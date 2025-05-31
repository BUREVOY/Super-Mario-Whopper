import * as Phaser from "phaser";
import { SCENES, COLORS, GAME_CONFIG, VIEWPORT_UTILS } from "../../constants";

export class MenuScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Text;
  private instructionsButton!: Phaser.GameObjects.Text;
  private creditsButton!: Phaser.GameObjects.Text;
  private background!: Phaser.GameObjects.Rectangle;
  private logo!: Phaser.GameObjects.Text;
  private subtitle!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    console.log("🎮 MenuScene: Сцена меню запущена!");
    console.log("🎮 MenuScene: Проверка доступных текстур...");

    // Проверяем ключевые текстуры
    const requiredTextures = ["bk_background", "player"];
    requiredTextures.forEach((key) => {
      if (this.textures.exists(key)) {
        console.log(`✅ MenuScene: ${key} доступен`);
      } else {
        console.log(`❌ MenuScene: ${key} НЕ доступен`);
      }
    });

    this.createBackground();
    this.createLogo();
    this.createMenu();
    this.createAnimations();
    this.setupInput();

    console.log("🎮 MenuScene: Инициализация завершена!");

    // Дополнительная проверка видимости сцены
    console.log("🎮 MenuScene: Проверка видимости сцены...");
    console.log("🎮 MenuScene: Сцена активна:", this.scene.isActive());
    console.log("🎮 MenuScene: Сцена видима:", this.scene.isVisible());
    console.log("🎮 MenuScene: Камера видима:", this.cameras.main.visible);

    // Принудительно делаем сцену видимой
    this.scene.setVisible(true);
    this.cameras.main.setVisible(true);

    console.log("🎮 MenuScene: Принудительно установили видимость");
  }

  private createBackground(): void {
    console.log("🎮 MenuScene: Создание фона...");

    // Фон в стиле ресторана Burger King
    // Проверяем доступные текстуры фона
    let backgroundKey = "bk_background";
    if (
      !this.textures.exists("bk_background") &&
      this.textures.exists("bk_restaurant")
    ) {
      backgroundKey = "bk_restaurant";
      console.log(
        "🎮 MenuScene: Используем bk_restaurant вместо bk_background"
      );
    }

    if (this.textures.exists(backgroundKey)) {
      this.background = this.add.rectangle(
        0,
        0,
        GAME_CONFIG.WIDTH,
        GAME_CONFIG.HEIGHT,
        0
      );
      this.background.setOrigin(0, 0);
      this.background.setDisplaySize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
      this.background.setAlpha(0.8);
      console.log(`✅ MenuScene: Фон ${backgroundKey} создан`);
    } else {
      // Fallback - простой цветной фон
      this.background = this.add.rectangle(
        GAME_CONFIG.WIDTH / 2,
        GAME_CONFIG.HEIGHT / 2,
        GAME_CONFIG.WIDTH,
        GAME_CONFIG.HEIGHT,
        parseInt(COLORS.BK_RED.replace("#", ""), 16)
      );
      console.log("⚠️ MenuScene: Используем fallback фон");
    }

    // Добавляем оверлей для лучшей читаемости текста
    this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      GAME_CONFIG.WIDTH,
      GAME_CONFIG.HEIGHT,
      0x000000,
      0.4
    );

    console.log("✅ MenuScene: Фон создан успешно");
  }

  private createLogo(): void {
    console.log("🎮 MenuScene: Создание логотипа...");

    // Определяем размеры для адаптивности
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isMobile = VIEWPORT_UTILS.isMobile();
    const isPortrait = VIEWPORT_UTILS.isPortrait();

    // Адаптивные размеры и позиции
    const logoSize = isMobile ? (isPortrait ? "36px" : "32px") : "64px";
    const subtitleSize = isMobile ? (isPortrait ? "18px" : "16px") : "24px";
    const logoY = isMobile ? (isPortrait ? height * 0.15 : height * 0.12) : 150;
    const subtitleY = isMobile
      ? isPortrait
        ? height * 0.22
        : height * 0.2
      : 220;
    const crownY = isMobile ? (isPortrait ? height * 0.1 : height * 0.08) : 100;
    const crownSize = isMobile ? (isPortrait ? "32px" : "28px") : "48px";

    try {
      // Главный логотип игры
      this.logo = this.add.text(width / 2, logoY, "SUPER MARIO WHOPPER", {
        fontSize: logoSize,
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Black",
        stroke: COLORS.BLACK,
        strokeThickness: isMobile ? 4 : 6,
        align: "center",
      });
      this.logo.setOrigin(0.5);

      console.log("✅ MenuScene: Логотип создан успешно");
    } catch (error) {
      console.error("❌ MenuScene: Ошибка при создании логотипа:", error);
    }

    // Подзаголовок
    this.subtitle = this.add.text(
      width / 2,
      subtitleY,
      "Платформер в стиле Burger King",
      {
        fontSize: subtitleSize,
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
        align: "center",
      }
    );
    this.subtitle.setOrigin(0.5);

    // Добавляем корону над логотипом
    const crown = this.add.text(width / 2, crownY, "👑", {
      fontSize: crownSize,
    });
    crown.setOrigin(0.5);
  }

  private createMenu(): void {
    console.log("🎮 MenuScene: Создание меню...");

    // Определяем размеры для адаптивности
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const isMobile = VIEWPORT_UTILS.isMobile();
    const isPortrait = VIEWPORT_UTILS.isPortrait();

    // Адаптивные размеры и позиции
    const buttonSize = isMobile ? (isPortrait ? "24px" : "22px") : "32px";
    const buttonSpacing = isMobile ? (isPortrait ? 60 : 50) : 80;
    const startButtonY = isMobile
      ? isPortrait
        ? height * 0.35
        : height * 0.32
      : 320;
    const instructionsButtonY = startButtonY + buttonSpacing;
    const creditsButtonY = instructionsButtonY + buttonSpacing;
    const orderButtonY = creditsButtonY + buttonSpacing * 1.5;

    const buttonStyle = {
      fontSize: buttonSize,
      color: COLORS.WHITE,
      fontFamily: "Arial Bold",
      backgroundColor: COLORS.BK_RED,
      padding: { x: isMobile ? 15 : 20, y: isMobile ? 8 : 10 },
      stroke: COLORS.BLACK,
      strokeThickness: 2,
      align: "center",
    };

    const hoverStyle = {
      fontSize: buttonSize,
      color: COLORS.BK_YELLOW,
      fontFamily: "Arial Bold",
      backgroundColor: COLORS.BK_BROWN,
      padding: { x: isMobile ? 15 : 20, y: isMobile ? 8 : 10 },
      stroke: COLORS.BLACK,
      strokeThickness: 2,
      align: "center",
    };

    // Специальный стиль для кнопки заказа
    const orderButtonStyle = {
      fontSize: buttonSize,
      color: COLORS.WHITE,
      fontFamily: "Arial Bold",
      backgroundColor: COLORS.BK_ORANGE,
      padding: { x: isMobile ? 15 : 20, y: isMobile ? 8 : 10 },
      stroke: COLORS.BLACK,
      strokeThickness: 2,
      align: "center",
    };

    const orderHoverStyle = {
      fontSize: buttonSize,
      color: COLORS.BK_YELLOW,
      fontFamily: "Arial Bold",
      backgroundColor: COLORS.BK_RED,
      padding: { x: isMobile ? 15 : 20, y: isMobile ? 8 : 10 },
      stroke: COLORS.BLACK,
      strokeThickness: 2,
      align: "center",
    };

    try {
      // Кнопка "Начать игру"
      this.startButton = this.add.text(
        width / 2,
        startButtonY,
        "НАЧАТЬ ИГРУ",
        buttonStyle
      );
      this.startButton.setOrigin(0.5);
      this.setupButtonEvents(this.startButton, hoverStyle, buttonStyle, () =>
        this.startGame()
      );

      // Кнопка "Инструкции"
      this.instructionsButton = this.add.text(
        width / 2,
        instructionsButtonY,
        "КАК ИГРАТЬ",
        buttonStyle
      );
      this.instructionsButton.setOrigin(0.5);
      this.setupButtonEvents(
        this.instructionsButton,
        hoverStyle,
        buttonStyle,
        () => this.showInstructions()
      );

      // Кнопка "Создатели"
      this.creditsButton = this.add.text(
        width / 2,
        creditsButtonY,
        "О ИГРЕ",
        buttonStyle
      );
      this.creditsButton.setOrigin(0.5);
      this.setupButtonEvents(this.creditsButton, hoverStyle, buttonStyle, () =>
        this.showCredits()
      );

      // Специальная кнопка "Заказать Whopper" - только на десктопе
      if (!isMobile) {
        const orderButton = this.add.text(
          width / 2,
          orderButtonY,
          "🍔 ЗАКАЗАТЬ WHOPPER",
          orderButtonStyle
        );
        orderButton.setOrigin(0.5);
        this.setupButtonEvents(
          orderButton,
          orderHoverStyle,
          orderButtonStyle,
          () => this.openBurgerKingWebsite()
        );
      }

      console.log("✅ MenuScene: Меню создано успешно");
    } catch (error) {
      console.error("❌ MenuScene: Ошибка при создании меню:", error);
    }

    // Информация об управлении внизу экрана
    const controlsText = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT - 100,
      "Управление: ← → для движения, ↑ или ПРОБЕЛ для прыжка, P для паузы",
      {
        fontSize: "16px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 1,
      }
    );
    controlsText.setOrigin(0.5);

    // Версия игры
    const versionText = this.add.text(
      GAME_CONFIG.WIDTH - 20,
      GAME_CONFIG.HEIGHT - 20,
      "v1.0.0",
      {
        fontSize: "14px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
      }
    );
    versionText.setOrigin(1);
    versionText.setAlpha(0.7);
  }

  private setupButtonEvents(
    button: Phaser.GameObjects.Text,
    hoverStyle: Phaser.Types.GameObjects.Text.TextStyle,
    normalStyle: Phaser.Types.GameObjects.Text.TextStyle,
    callback: () => void
  ): void {
    button.on("pointerover", () => {
      button.setStyle(hoverStyle);
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100,
        ease: "Power2",
      });
    });

    button.on("pointerout", () => {
      button.setStyle(normalStyle);
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
        ease: "Power2",
      });
    });

    button.on("pointerdown", () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        ease: "Power2",
        onComplete: callback,
      });
    });
  }

  private createAnimations(): void {
    // Анимация логотипа
    this.tweens.add({
      targets: this.logo,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Анимация подзаголовка
    this.tweens.add({
      targets: this.subtitle,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Создание плавающих частиц в стиле BK
    this.createFloatingParticles();
  }

  private createFloatingParticles(): void {
    // Создаем плавающие частицы в виде элементов BK
    const particles = ["🍔", "🍟", "🥤", "👑"];

    for (let i = 0; i < 10; i++) {
      const particle = this.add.text(
        Phaser.Math.Between(0, GAME_CONFIG.WIDTH),
        Phaser.Math.Between(0, GAME_CONFIG.HEIGHT),
        Phaser.Utils.Array.GetRandom(particles),
        { fontSize: "24px" }
      );
      particle.setAlpha(0.3);

      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        x: particle.x + Phaser.Math.Between(-50, 50),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        delay: Phaser.Math.Between(0, 2000),
        repeat: -1,
        onRepeat: () => {
          particle.setPosition(
            Phaser.Math.Between(0, GAME_CONFIG.WIDTH),
            GAME_CONFIG.HEIGHT + 50
          );
          particle.setAlpha(0.3);
        },
      });
    }
  }

  private setupInput(): void {
    // Настройка клавиатурного управления
    const enterKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    enterKey.on("down", () => this.startGame());

    const escKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    escKey.on("down", () => this.showCredits());

    // Навигация по меню с помощью стрелок
    const upKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP
    );
    const downKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );

    let selectedButton = 0;
    const buttons = [
      this.startButton,
      this.add.text(0, 0, ""), // Placeholder для кнопки заказа (она создается локально)
      this.instructionsButton,
      this.creditsButton,
    ];

    upKey.on("down", () => {
      selectedButton = (selectedButton - 1 + buttons.length) % buttons.length;
      this.highlightButton(buttons, selectedButton);
    });

    downKey.on("down", () => {
      selectedButton = (selectedButton + 1) % buttons.length;
      this.highlightButton(buttons, selectedButton);
    });

    // Обработка Enter для выбранной кнопки
    const selectKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    selectKey.on("down", () => {
      switch (selectedButton) {
        case 0:
          this.startGame();
          break;
        case 1:
          this.openBurgerKingWebsite();
          break;
        case 2:
          this.showInstructions();
          break;
        case 3:
          this.showCredits();
          break;
      }
    });
  }

  private highlightButton(
    buttons: Phaser.GameObjects.Text[],
    selectedIndex: number
  ): void {
    buttons.forEach((button, index) => {
      if (index === selectedIndex) {
        button.setTint(0xffff00); // Желтый цвет для выделения
        this.tweens.add({
          targets: button,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 100,
        });
      } else {
        button.clearTint();
        this.tweens.add({
          targets: button,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
        });
      }
    });
  }

  private startGame(): void {
    // Эффект перехода
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.start(SCENES.GAME);
    });
  }

  private showInstructions(): void {
    // Создание модального окна с инструкциями
    const modal = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      600,
      400,
      0x000000,
      0.9
    );
    modal.setStrokeStyle(4, parseInt(COLORS.BK_YELLOW.replace("#", ""), 16));

    const instructionsText = `
ИНСТРУКЦИИ

Цель: Пройти уровень, собирая бонусы и избегая врагов

Управление:
← → - Движение влево/вправо
↑ или ПРОБЕЛ - Прыжок
P - Пауза
R - Перезапуск уровня

Враги:
🍔 Бургер - медленный, но живучий
🍟 Картошка - быстрая, может прыгать
🥤 Газировка - создает препятствия

Бонусы:
👑 Корона - неуязвимость
🍔 Воппер - дополнительная жизнь
🧅 Луковые кольца - ускорение

Нажмите любую клавишу для закрытия
    `;

    const text = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      instructionsText,
      {
        fontSize: "16px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        align: "center",
      }
    );
    text.setOrigin(0.5);

    // Закрытие по любой клавише
    const closeHandler = () => {
      modal.destroy();
      text.destroy();
      this.input.keyboard!.off("keydown", closeHandler);
    };
    this.input.keyboard!.on("keydown", closeHandler);
  }

  private showCredits(): void {
    // Создание модального окна с авторами
    const modal = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      500,
      300,
      0x000000,
      0.9
    );
    modal.setStrokeStyle(4, parseInt(COLORS.BK_YELLOW.replace("#", ""), 16));

    const creditsText = `
SUPER MARIO WHOPPER

Made with love by Арсений Юдаков

Создано с использованием:
• Phaser 3 - игровой движок
• TypeScript - язык программирования
• Next.js - веб-фреймворк
• shadcn/ui - UI компоненты

Вдохновлено:
• Super Mario Bros
• Burger King

Версия: 1.0.0

Нажмите любую клавишу для закрытия
    `;

    const text = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      creditsText,
      {
        fontSize: "16px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        align: "center",
      }
    );
    text.setOrigin(0.5);

    // Закрытие по любой клавише
    const closeHandler = () => {
      modal.destroy();
      text.destroy();
      this.input.keyboard!.off("keydown", closeHandler);
    };
    this.input.keyboard!.on("keydown", closeHandler);
  }

  private openBurgerKingWebsite(): void {
    console.log("🍔 MenuScene: Перенаправление на сайт Burger King...");

    // Показываем уведомление перед переходом
    const modal = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      500,
      300,
      0x000000,
      0.9
    );
    modal.setStrokeStyle(4, parseInt(COLORS.BK_YELLOW.replace("#", ""), 16));

    const notificationText = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2 - 30,
      "🍔 Переходим на сайт Burger King!\n\n🍟 Заказывайте вкусные Whopper,\nкартошку фри и другие блюда!\n\n👑 Burger King - Вкус правит!",
      {
        fontSize: "20px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
        align: "center",
      }
    );
    notificationText.setOrigin(0.5);

    // Кнопка "Перейти"
    const goButton = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2 - 80,
      GAME_CONFIG.HEIGHT / 2 + 80,
      120,
      40,
      parseInt(COLORS.BK_RED.replace("#", ""), 16)
    );
    goButton.setStrokeStyle(3, parseInt(COLORS.BLACK.replace("#", ""), 16));

    const goText = this.add.text(
      GAME_CONFIG.WIDTH / 2 - 80,
      GAME_CONFIG.HEIGHT / 2 + 80,
      "ПЕРЕЙТИ",
      {
        fontSize: "16px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
      }
    );
    goText.setOrigin(0.5);

    // Кнопка "Отмена"
    const cancelButton = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2 + 80,
      GAME_CONFIG.HEIGHT / 2 + 80,
      120,
      40,
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16)
    );
    cancelButton.setStrokeStyle(3, parseInt(COLORS.BLACK.replace("#", ""), 16));

    const cancelText = this.add.text(
      GAME_CONFIG.WIDTH / 2 + 80,
      GAME_CONFIG.HEIGHT / 2 + 80,
      "ОТМЕНА",
      {
        fontSize: "16px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
      }
    );
    cancelText.setOrigin(0.5);

    // Интерактивность кнопок
    goButton.setInteractive();
    goButton.on("pointerdown", () => {
      // Открываем сайт Burger King в новой вкладке
      window.open(
        "https://edu.burgerkingrus.ru/view_doc.html?mode=bkpoll&getpoll=KingGuru_8_years",
        "_blank"
      );

      // Закрываем модальное окно
      modal.destroy();
      notificationText.destroy();
      goButton.destroy();
      goText.destroy();
      cancelButton.destroy();
      cancelText.destroy();
    });

    goButton.on("pointerover", () => {
      goButton.setFillStyle(parseInt(COLORS.BK_ORANGE.replace("#", ""), 16));
    });

    goButton.on("pointerout", () => {
      goButton.setFillStyle(parseInt(COLORS.BK_RED.replace("#", ""), 16));
    });

    cancelButton.setInteractive();
    cancelButton.on("pointerdown", () => {
      // Закрываем модальное окно
      modal.destroy();
      notificationText.destroy();
      goButton.destroy();
      goText.destroy();
      cancelButton.destroy();
      cancelText.destroy();
    });

    cancelButton.on("pointerover", () => {
      cancelButton.setFillStyle(
        parseInt(COLORS.BK_ORANGE.replace("#", ""), 16)
      );
    });

    cancelButton.on("pointerout", () => {
      cancelButton.setFillStyle(parseInt(COLORS.BK_BROWN.replace("#", ""), 16));
    });

    // Анимация появления модального окна
    modal.setAlpha(0);
    notificationText.setAlpha(0);
    goButton.setAlpha(0);
    goText.setAlpha(0);
    cancelButton.setAlpha(0);
    cancelText.setAlpha(0);

    this.tweens.add({
      targets: [
        modal,
        notificationText,
        goButton,
        goText,
        cancelButton,
        cancelText,
      ],
      alpha: 1,
      duration: 300,
      ease: "Power2",
    });
  }

  private createStartButton(): void {
    const button = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 100,
        "🎮 НАЧАТЬ ИГРУ",
        {
          fontSize: "28px",
          color: "#FFFFFF",
          backgroundColor: "#D32F2F",
          padding: { x: 20, y: 10 },
        }
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Добавляем анимации наведения
    button.on("pointerover", () => {
      this.tweens.add({
        targets: button,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: "Power2",
      });

      // Воспроизводим звук если доступен
      if (this.cache.audio.exists("ui_hover")) {
        this.sound.play("ui_hover", { volume: 0.3 });
      }
    });

    button.on("pointerout", () => {
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: "Power2",
      });
    });

    button.on("pointerdown", () => {
      // Воспроизводим звук клика если доступен
      if (this.cache.audio.exists("ui_click")) {
        this.sound.play("ui_click", { volume: 0.5 });
      }

      // Переходим к игре
      this.scene.start(SCENES.GAME);
    });
  }

  private createFullscreenButton(): void {
    // Кнопка полноэкранного режима (только для настольных устройств)
    if (!this.sys.game.device.os.desktop) return;

    const fullscreenButton = this.add
      .text(
        this.cameras.main.width - 20,
        20,
        this.scale.isFullscreen ? "📤 Выйти" : "📺 Полный экран",
        {
          fontSize: "16px",
          color: "#FFFFFF",
          backgroundColor: "#5D4037",
          padding: { x: 10, y: 5 },
        }
      )
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    fullscreenButton.on("pointerdown", () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
    });

    // Обновляем текст кнопки при изменении режима
    this.scale.on("fullscreenchange", () => {
      fullscreenButton.setText(
        this.scale.isFullscreen ? "📤 Выйти" : "📺 Полный экран"
      );
    });
  }
}
