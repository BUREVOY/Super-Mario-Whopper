import * as Phaser from "phaser";
import { SCENES } from "../../constants";
import { COLORS } from "../../constants";

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

    // Фон в стиле Burger King
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      parseInt(COLORS.BK_RED.replace("#", ""), 16)
    );

    // Заголовок Game Over
    const gameOverText = this.add.text(
      width / 2,
      height / 2 - 150,
      "GAME OVER",
      {
        fontSize: "64px",
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Black",
        stroke: COLORS.BLACK,
        strokeThickness: 4,
      }
    );
    gameOverText.setOrigin(0.5);

    // Подзаголовок
    const subtitleText = this.add.text(
      width / 2,
      height / 2 - 80,
      "Твой Whopper закончился!",
      {
        fontSize: "24px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    subtitleText.setOrigin(0.5);

    // Показать счет
    const scoreText = this.add.text(
      width / 2,
      height / 2 - 20,
      `Финальный счет: ${this.score}`,
      {
        fontSize: "32px",
        color: COLORS.BK_YELLOW,
        fontFamily: "Arial Bold",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    scoreText.setOrigin(0.5);

    // Показать уровень
    const levelText = this.add.text(
      width / 2,
      height / 2 + 20,
      `Достигнутый уровень: ${this.level}`,
      {
        fontSize: "24px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    levelText.setOrigin(0.5);

    // Кнопка "Играть снова"
    const playAgainButton = this.add.rectangle(
      width / 2,
      height / 2 + 80,
      200,
      50,
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
    );
    playAgainButton.setStrokeStyle(
      3,
      parseInt(COLORS.BLACK.replace("#", ""), 16)
    );

    const playAgainText = this.add.text(
      width / 2,
      height / 2 + 80,
      "ИГРАТЬ СНОВА",
      {
        fontSize: "18px",
        color: COLORS.BLACK,
        fontFamily: "Arial Bold",
      }
    );
    playAgainText.setOrigin(0.5);

    // Кнопка "В меню"
    const menuButton = this.add.rectangle(
      width / 2,
      height / 2 + 150,
      200,
      50,
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16)
    );
    menuButton.setStrokeStyle(3, parseInt(COLORS.BLACK.replace("#", ""), 16));

    const menuText = this.add.text(
      width / 2,
      height / 2 + 150,
      "ГЛАВНОЕ МЕНЮ",
      {
        fontSize: "18px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
      }
    );
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

    // Управление клавиатурой
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

    // Подсказка по управлению
    const controlsText = this.add.text(
      width / 2,
      height - 50,
      "ПРОБЕЛ - играть снова | ESC - в меню",
      {
        fontSize: "16px",
        color: COLORS.WHITE,
        fontFamily: "Arial",
      }
    );
    controlsText.setOrigin(0.5);
    controlsText.setAlpha(0.8);

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
