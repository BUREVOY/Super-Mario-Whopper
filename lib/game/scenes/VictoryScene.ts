import * as Phaser from "phaser";
import { SCENES, COLORS, VIEWPORT_UTILS } from "../../constants";

export class VictoryScene extends Phaser.Scene {
  private score: number = 0;
  private level: number = 1;
  private timeBonus: number = 0;

  constructor() {
    super({ key: SCENES.VICTORY });
  }

  init(data: { score: number; level: number; timeBonus: number }): void {
    this.score = data.score || 0;
    this.level = data.level || 1;
    this.timeBonus = data.timeBonus || 0;
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Определяем размеры для адаптивности
    const isMobile = VIEWPORT_UTILS.isMobile();
    const isPortrait = VIEWPORT_UTILS.isPortrait();

    // Адаптивные размеры шрифтов
    const titleSize = isMobile ? (isPortrait ? "48px" : "42px") : "56px";
    const subtitleSize = isMobile ? (isPortrait ? "24px" : "22px") : "28px";
    const scoreSize = isMobile ? (isPortrait ? "28px" : "26px") : "32px";
    const bonusSize = isMobile ? (isPortrait ? "20px" : "18px") : "24px";
    const levelSize = isMobile ? (isPortrait ? "18px" : "16px") : "20px";
    const buttonTextSize = isMobile ? (isPortrait ? "16px" : "14px") : "18px";
    const controlsSize = isMobile ? (isPortrait ? "14px" : "12px") : "16px";

    // Адаптивные размеры кнопок
    const buttonWidth = isMobile ? (isPortrait ? 200 : 180) : 250;
    const buttonHeight = isMobile ? (isPortrait ? 45 : 40) : 50;
    const menuButtonWidth = isMobile ? (isPortrait ? 160 : 140) : 200;

    // Адаптивное расположение элементов
    const centerY = height / 2;
    const titleY = centerY - (isMobile ? (isPortrait ? 200 : 120) : 150);
    const subtitleY = centerY - (isMobile ? (isPortrait ? 140 : 80) : 80);
    const scoreY = centerY - (isMobile ? (isPortrait ? 80 : 40) : 20);
    const bonusY = centerY - (isMobile ? (isPortrait ? 40 : 10) : -20);
    const levelY = centerY - (isMobile ? (isPortrait ? 0 : -20) : -60);
    const firstButtonY = centerY + (isMobile ? (isPortrait ? 60 : 40) : 120);
    const secondButtonY = centerY + (isMobile ? (isPortrait ? 120 : 90) : 190);

    // Фон в стиле Burger King
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
    );

    // Заголовок Victory
    const victoryText = this.add.text(width / 2, titleY, "УРОВЕНЬ ПРОЙДЕН!", {
      fontSize: titleSize,
      color: COLORS.BK_RED,
      fontFamily: "Arial Black",
      stroke: COLORS.BLACK,
      strokeThickness: isMobile ? 3 : 4,
      align: "center",
    });
    victoryText.setOrigin(0.5);

    // Подзаголовок
    const subtitleText = this.add.text(
      width / 2,
      subtitleY,
      "Whopper достигнут!",
      {
        fontSize: subtitleSize,
        color: COLORS.BK_BROWN,
        fontFamily: "Arial Bold",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
        align: "center",
      }
    );
    subtitleText.setOrigin(0.5);

    // Показать счет
    const scoreText = this.add.text(width / 2, scoreY, `Счет: ${this.score}`, {
      fontSize: scoreSize,
      color: COLORS.BK_RED,
      fontFamily: "Arial Bold",
      stroke: COLORS.BLACK,
      strokeThickness: 2,
      align: "center",
    });
    scoreText.setOrigin(0.5);

    // Показать бонус за время
    const bonusText = this.add.text(
      width / 2,
      bonusY,
      `Бонус за время: +${this.timeBonus}`,
      {
        fontSize: bonusSize,
        color: COLORS.BK_BROWN,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: isMobile ? 1 : 2,
        align: "center",
      }
    );
    bonusText.setOrigin(0.5);

    // Показать уровень
    const levelText = this.add.text(
      width / 2,
      levelY,
      `Уровень ${this.level} завершен!`,
      {
        fontSize: levelSize,
        color: COLORS.BK_BROWN,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 1,
        align: "center",
      }
    );
    levelText.setOrigin(0.5);

    // Кнопка "Пройти опрос" (бывшая "Следующий уровень")
    const nextLevelButton = this.add.rectangle(
      width / 2,
      firstButtonY,
      buttonWidth,
      buttonHeight,
      parseInt(COLORS.BK_RED.replace("#", ""), 16)
    );
    nextLevelButton.setStrokeStyle(
      3,
      parseInt(COLORS.BLACK.replace("#", ""), 16)
    );

    const nextLevelText = this.add.text(
      width / 2,
      firstButtonY,
      "ПОПРОБОВАТЬ СНОВА",
      {
        fontSize: buttonTextSize,
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
        align: "center",
      }
    );
    nextLevelText.setOrigin(0.5);

    // Кнопка "В меню"
    const menuButton = this.add.rectangle(
      width / 2,
      secondButtonY,
      menuButtonWidth,
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
    nextLevelButton.setInteractive();
    nextLevelButton.on("pointerdown", () => {
      // Перезапускаем игру
      this.scene.start(SCENES.GAME);
    });

    nextLevelButton.on("pointerover", () => {
      nextLevelButton.setFillStyle(
        parseInt(COLORS.BK_ORANGE.replace("#", ""), 16)
      );
    });

    nextLevelButton.on("pointerout", () => {
      nextLevelButton.setFillStyle(
        parseInt(COLORS.BK_RED.replace("#", ""), 16)
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
          color: COLORS.BK_BROWN,
          fontFamily: "Arial",
          align: "center",
        }
      );
      controlsText.setOrigin(0.5);
      controlsText.setAlpha(0.8);
    }

    // Анимация появления
    this.tweens.add({
      targets: [victoryText, subtitleText],
      alpha: { from: 0, to: 1 },
      scaleX: { from: 0.5, to: 1 },
      scaleY: { from: 0.5, to: 1 },
      duration: 1000,
      ease: "Back.easeOut",
    });

    this.tweens.add({
      targets: [scoreText, bonusText, levelText],
      alpha: { from: 0, to: 1 },
      y: { from: "+=30", to: "-=30" },
      duration: 800,
      ease: "Power2",
      delay: 500,
    });

    this.tweens.add({
      targets: [nextLevelButton, nextLevelText, menuButton, menuText],
      alpha: { from: 0, to: 1 },
      scaleX: { from: 0.8, to: 1 },
      scaleY: { from: 0.8, to: 1 },
      duration: 600,
      ease: "Back.easeOut",
      delay: 1000,
    });

    // Эффект конфетти
    this.createConfetti();
  }

  private createConfetti(): void {
    const colors = [
      parseInt(COLORS.BK_RED.replace("#", ""), 16),
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16),
      parseInt(COLORS.BK_ORANGE.replace("#", ""), 16),
    ];

    for (let i = 0; i < 50; i++) {
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, this.cameras.main.width),
        -20,
        8,
        8,
        colors[Phaser.Math.Between(0, colors.length - 1)]
      );

      this.tweens.add({
        targets: confetti,
        y: this.cameras.main.height + 20,
        x: confetti.x + Phaser.Math.Between(-100, 100),
        rotation: Phaser.Math.Between(0, 6.28),
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 2000),
        onComplete: () => {
          confetti.destroy();
        },
      });
    }
  }
}
