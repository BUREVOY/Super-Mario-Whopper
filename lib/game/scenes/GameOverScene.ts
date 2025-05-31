import * as Phaser from "phaser";
import { SCENES, COLORS, VIEWPORT_UTILS } from "../../constants";

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private level: number = 1;

  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  init(data: { score: number; level: number }): void {
    this.score = data.score || 0;
    this.level = data.level || 1;
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Определяем размеры для адаптивности
    const isMobile = VIEWPORT_UTILS.isMobile();
    const isPortrait = VIEWPORT_UTILS.isPortrait();

    // Адаптивные размеры шрифтов
    const titleSize = isMobile ? (isPortrait ? "48px" : "42px") : "64px";
    const subtitleSize = isMobile ? (isPortrait ? "20px" : "18px") : "24px";
    const scoreSize = isMobile ? (isPortrait ? "24px" : "22px") : "32px";
    const levelSize = isMobile ? (isPortrait ? "20px" : "18px") : "24px";
    const buttonTextSize = isMobile ? (isPortrait ? "16px" : "14px") : "18px";
    const controlsSize = isMobile ? (isPortrait ? "14px" : "12px") : "16px";

    // Адаптивные размеры кнопок
    const buttonWidth = isMobile ? (isPortrait ? 180 : 160) : 200;
    const buttonHeight = isMobile ? (isPortrait ? 45 : 40) : 50;

    // Адаптивное расположение элементов
    const centerY = height / 2;
    const titleY = centerY - (isMobile ? (isPortrait ? 200 : 120) : 150);
    const subtitleY = centerY - (isMobile ? (isPortrait ? 140 : 80) : 80);
    const scoreY = centerY - (isMobile ? (isPortrait ? 80 : 40) : 20);
    const levelY = centerY - (isMobile ? (isPortrait ? 40 : 10) : -20);
    const firstButtonY = centerY + (isMobile ? (isPortrait ? 40 : 30) : 80);
    const secondButtonY = centerY + (isMobile ? (isPortrait ? 100 : 80) : 150);

    // Фон в стиле Burger King
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      parseInt(COLORS.BK_RED.replace("#", ""), 16)
    );

    // Заголовок Game Over
    const gameOverText = this.add.text(width / 2, titleY, "GAME OVER", {
      fontSize: titleSize,
      color: COLORS.BK_YELLOW,
      fontFamily: "Arial Black",
      stroke: COLORS.BLACK,
      strokeThickness: isMobile ? 3 : 4,
      align: "center",
    });
    gameOverText.setOrigin(0.5);

    // Подзаголовок
    const subtitleText = this.add.text(
      width / 2,
      subtitleY,
      "Твой Whopper закончился!",
      {
        fontSize: subtitleSize,
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
        align: "center",
      }
    );
    subtitleText.setOrigin(0.5);

    // Показать счет
    const scoreText = this.add.text(
      width / 2,
      scoreY,
      `Финальный счет: ${this.score}`,
      {
        fontSize: scoreSize,
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Bold",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
        align: "center",
      }
    );
    scoreText.setOrigin(0.5);

    // Показать уровень
    const levelText = this.add.text(
      width / 2,
      levelY,
      `Достигнутый уровень: ${this.level}`,
      {
        fontSize: levelSize,
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
        align: "center",
      }
    );
    levelText.setOrigin(0.5);

    // Кнопка "Играть снова"
    const playAgainButton = this.add.rectangle(
      width / 2,
      firstButtonY,
      buttonWidth,
      buttonHeight,
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
    );
    playAgainButton.setStrokeStyle(
      3,
      parseInt(COLORS.BLACK.replace("#", ""), 16)
    );

    const playAgainText = this.add.text(
      width / 2,
      firstButtonY,
      "ИГРАТЬ СНОВА",
      {
        fontSize: buttonTextSize,
        color: COLORS.BLACK,
        fontFamily: "Arial Bold",
        align: "center",
      }
    );
    playAgainText.setOrigin(0.5);

    // Кнопка "В меню"
    const menuButton = this.add.rectangle(
      width / 2,
      secondButtonY,
      buttonWidth,
      buttonHeight,
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16)
    );
    menuButton.setStrokeStyle(3, parseInt(COLORS.BLACK.replace("#", ""), 16));

    const menuText = this.add.text(width / 2, secondButtonY, "ГЛАВНОЕ МЕНЮ", {
      fontSize: buttonTextSize,
      color: COLORS.WHITE,
      fontFamily: "Arial Bold",
      align: "center",
    });
    menuText.setOrigin(0.5);

    // Интерактивность кнопок
    playAgainButton.setInteractive();
    playAgainButton.on("pointerdown", () => {
      this.scene.start(SCENES.GAME);
    });

    playAgainButton.on("pointerover", () => {
      playAgainButton.setFillStyle(
        parseInt(COLORS.BK_ORANGE.replace("#", ""), 16)
      );
    });

    playAgainButton.on("pointerout", () => {
      playAgainButton.setFillStyle(
        parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
      );
    });

    menuButton.setInteractive();
    menuButton.on("pointerdown", () => {
      this.scene.start(SCENES.MENU);
    });

    menuButton.on("pointerover", () => {
      menuButton.setFillStyle(parseInt(COLORS.BK_ORANGE.replace("#", ""), 16));
    });

    menuButton.on("pointerout", () => {
      menuButton.setFillStyle(parseInt(COLORS.BK_BROWN.replace("#", ""), 16));
    });

    // Управление клавиатурой - только на десктопе
    if (!isMobile) {
      const spaceKey = this.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      spaceKey.on("down", () => {
        this.scene.start(SCENES.GAME);
      });

      const escKey = this.input.keyboard!.addKey(
        Phaser.Input.Keyboard.KeyCodes.ESC
      );
      escKey.on("down", () => {
        this.scene.start(SCENES.MENU);
      });

      // Подсказка по управлению - только на десктопе
      const controlsText = this.add.text(
        width / 2,
        height - 30,
        "ПРОБЕЛ - играть снова | ESC - в меню",
        {
          fontSize: controlsSize,
          color: COLORS.WHITE,
          fontFamily: "Arial",
          align: "center",
        }
      );
      controlsText.setOrigin(0.5);
      controlsText.setAlpha(0.8);
    }

    // Анимация появления
    this.tweens.add({
      targets: [gameOverText, subtitleText, scoreText, levelText],
      alpha: { from: 0, to: 1 },
      y: { from: "-=50", to: "+=50" },
      duration: 1000,
      ease: "Power2",
      delay: (i: number) => i * 200,
    });

    this.tweens.add({
      targets: [playAgainButton, playAgainText, menuButton, menuText],
      alpha: { from: 0, to: 1 },
      scaleX: { from: 0.8, to: 1 },
      scaleY: { from: 0.8, to: 1 },
      duration: 800,
      ease: "Back.easeOut",
      delay: 1000,
    });
  }
}
