import Phaser from "phaser";
import { SCENES, COLORS, GAME_CONFIG } from "../../constants";

export class MenuScene extends Phaser.Scene {
  private startButton!: Phaser.GameObjects.Text;
  private instructionsButton!: Phaser.GameObjects.Text;
  private creditsButton!: Phaser.GameObjects.Text;
  private background!: Phaser.GameObjects.Image;
  private logo!: Phaser.GameObjects.Text;
  private subtitle!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    this.createBackground();
    this.createLogo();
    this.createMenu();
    this.createAnimations();
    this.setupInput();
  }

  private createBackground(): void {
    // Фон в стиле ресторана Burger King
    this.background = this.add.image(0, 0, "bk_background");
    this.background.setOrigin(0, 0);
    this.background.setDisplaySize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT);
    this.background.setAlpha(0.8);

    // Добавляем оверлей для лучшей читаемости текста
    const overlay = this.add.rectangle(
      GAME_CONFIG.WIDTH / 2,
      GAME_CONFIG.HEIGHT / 2,
      GAME_CONFIG.WIDTH,
      GAME_CONFIG.HEIGHT,
      0x000000,
      0.4
    );
  }

  private createLogo(): void {
    // Главный логотип игры
    this.logo = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      150,
      "SUPER MARIO WHOPPER",
      {
        fontSize: "64px",
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Black",
        stroke: COLORS.BLACK,
        strokeThickness: 6,
      }
    );
    this.logo.setOrigin(0.5);

    // Подзаголовок
    this.subtitle = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      220,
      "Платформер в стиле Burger King",
      {
        fontSize: "24px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    this.subtitle.setOrigin(0.5);

    // Добавляем корону над логотипом
    const crown = this.add.text(GAME_CONFIG.WIDTH / 2, 100, "👑", {
      fontSize: "48px",
    });
    crown.setOrigin(0.5);
  }

  private createMenu(): void {
    const buttonStyle = {
      fontSize: "32px",
      color: COLORS.WHITE,
      fontFamily: "Arial Bold",
      backgroundColor: COLORS.BK_RED,
      padding: { x: 20, y: 10 },
      stroke: COLORS.BLACK,
      strokeThickness: 2,
    };

    const hoverStyle = {
      fontSize: "32px",
      color: COLORS.BK_YELLOW,
      fontFamily: "Arial Bold",
      backgroundColor: COLORS.BK_BROWN,
      padding: { x: 20, y: 10 },
      stroke: COLORS.BLACK,
      strokeThickness: 2,
    };

    // Кнопка "Начать игру"
    this.startButton = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      350,
      "НАЧАТЬ ИГРУ",
      buttonStyle
    );
    this.startButton.setOrigin(0.5);
    this.startButton.setInteractive({ useHandCursor: true });

    // Кнопка "Инструкции"
    this.instructionsButton = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      420,
      "ИНСТРУКЦИИ",
      buttonStyle
    );
    this.instructionsButton.setOrigin(0.5);
    this.instructionsButton.setInteractive({ useHandCursor: true });

    // Кнопка "Авторы"
    this.creditsButton = this.add.text(
      GAME_CONFIG.WIDTH / 2,
      490,
      "АВТОРЫ",
      buttonStyle
    );
    this.creditsButton.setOrigin(0.5);
    this.creditsButton.setInteractive({ useHandCursor: true });

    // Настройка интерактивности кнопок
    this.setupButtonEvents(this.startButton, hoverStyle, buttonStyle, () =>
      this.startGame()
    );
    this.setupButtonEvents(
      this.instructionsButton,
      hoverStyle,
      buttonStyle,
      () => this.showInstructions()
    );
    this.setupButtonEvents(this.creditsButton, hoverStyle, buttonStyle, () =>
      this.showCredits()
    );

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
    hoverStyle: any,
    normalStyle: any,
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
}
