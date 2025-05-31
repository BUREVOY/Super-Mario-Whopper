import Phaser from "phaser";
import { SCENES, COLORS } from "../../constants";

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

    // Фон в стиле Burger King
    this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
    );

    // Заголовок Victory
    const victoryText = this.add.text(
      width / 2,
      height / 2 - 150,
      "УРОВЕНЬ ПРОЙДЕН!",
      {
        fontSize: "56px",
        color: COLORS.BK_RED,
        fontFamily: "Arial Black",
        stroke: COLORS.BLACK,
        strokeThickness: 4,
      }
    );
    victoryText.setOrigin(0.5);

    // Подзаголовок
    const subtitleText = this.add.text(
      width / 2,
      height / 2 - 80,
      "Whopper доставлен!",
      {
        fontSize: "28px",
        color: COLORS.BK_BROWN,
        fontFamily: "Arial Bold",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    subtitleText.setOrigin(0.5);

    // Показать счет
    const scoreText = this.add.text(
      width / 2,
      height / 2 - 20,
      `Счет: ${this.score}`,
      {
        fontSize: "32px",
        color: COLORS.BK_RED,
        fontFamily: "Arial Bold",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    scoreText.setOrigin(0.5);

    // Показать бонус за время
    const bonusText = this.add.text(
      width / 2,
      height / 2 + 20,
      `Бонус за время: +${this.timeBonus}`,
      {
        fontSize: "24px",
        color: COLORS.BK_BROWN,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 2,
      }
    );
    bonusText.setOrigin(0.5);

    // Показать уровень
    const levelText = this.add.text(
      width / 2,
      height / 2 + 60,
      `Уровень ${this.level} завершен!`,
      {
        fontSize: "20px",
        color: COLORS.BK_BROWN,
        fontFamily: "Arial",
        stroke: COLORS.BLACK,
        strokeThickness: 1,
      }
    );
    levelText.setOrigin(0.5);

    // Кнопка "Пройти опрос" (бывшая "Следующий уровень")
    const nextLevelButton = this.add.rectangle(
      width / 2,
      height / 2 + 120,
      250,
      50,
      parseInt(COLORS.BK_RED.replace("#", ""), 16)
    );
    nextLevelButton.setStrokeStyle(
      3,
      parseInt(COLORS.BLACK.replace("#", ""), 16)
    );

    const nextLevelText = this.add.text(
      width / 2,
      height / 2 + 120,
      "ПРОЙТИ ОПРОС",
      {
        fontSize: "18px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
      }
    );
    nextLevelText.setOrigin(0.5);

    // Кнопка "В меню"
    const menuButton = this.add.rectangle(
      width / 2,
      height / 2 + 190,
      200,
      50,
      parseInt(COLORS.BK_BROWN.replace("#", ""), 16)
    );
    menuButton.setStrokeStyle(3, parseInt(COLORS.BLACK.replace("#", ""), 16));

    const menuText = this.add.text(
      width / 2,
      height / 2 + 190,
      "ГЛАВНОЕ МЕНЮ",
      {
        fontSize: "18px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
      }
    );
    menuText.setOrigin(0.5);

    // Интерактивность кнопок
    nextLevelButton.setInteractive();
    nextLevelButton.on("pointerdown", () => {
      // Перенаправляем на сайт Burger King
      this.openBurgerKingWebsite();
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

    // Управление клавиатурой
    const spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spaceKey.on("down", () => {
      this.openBurgerKingWebsite();
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
      "ПРОБЕЛ - Пройти опрос | ESC - в меню",
      {
        fontSize: "16px",
        color: COLORS.BK_BROWN,
        fontFamily: "Arial",
      }
    );
    controlsText.setOrigin(0.5);
    controlsText.setAlpha(0.8);

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

  private openBurgerKingWebsite(): void {
    console.log("🍔 Перенаправление на сайт Burger King...");

    // Показываем уведомление перед переходом
    const notification = this.add.rectangle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      400,
      200,
      0x000000,
      0.9
    );
    notification.setStrokeStyle(
      4,
      parseInt(COLORS.BK_YELLOW.replace("#", ""), 16)
    );

    const notificationText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      "🍔 Переходим на сайт\nBurger King!\n\nЗаказывайте вкусные Whopper!",
      {
        fontSize: "20px",
        color: COLORS.WHITE,
        fontFamily: "Arial Bold",
        align: "center",
      }
    );
    notificationText.setOrigin(0.5);

    // Через 2 секунды открываем сайт
    this.time.delayedCall(2000, () => {
      // Открываем сайт Burger King в новой вкладке
      window.open(
        "https://edu.burgerkingrus.ru/view_doc.html?mode=bkpoll&getpoll=KingGuru_8_years",
        "_blank"
      );

      // Возвращаемся в главное меню
      this.scene.start(SCENES.MENU);
    });
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
